import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  PathFinderRegistry,
  instance as pathFinderRegistryInstance,
} from '@civ-clone/core-world-path/PathFinderRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  StrategyNoteRegistry,
  instance as strategyNoteRegistryInstance,
} from '@civ-clone/core-strategy/StrategyNoteRegistry';
import {
  generateKey as generateGoodSiteForCityKey,
  goodSiteForCity,
} from '../lib/goodSiteForCity';
import ActiveUnit from '@civ-clone/base-player-action-active-unit/ActiveUnit';
import GoTo from '@civ-clone/base-unit-action-goto/GoTo';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Settlers from '@civ-clone/base-unit-settlers/Settlers';
import Strategy from '@civ-clone/core-strategy/Strategy';
import Tile from '@civ-clone/core-world/Tile';

const MAX_TRAVEL_DISTANCE = 15;

export class MoveToGoodSiteForCity extends Strategy {
  #cityRegistry: CityRegistry;
  #pathFinderRegistry: PathFinderRegistry;
  #strategyNoteRegistry: StrategyNoteRegistry;

  constructor(
    cityRegistry: CityRegistry = cityRegistryInstance,
    pathFinderRegistry: PathFinderRegistry = pathFinderRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    strategyNoteRegistry: StrategyNoteRegistry = strategyNoteRegistryInstance
  ) {
    super(ruleRegistry);

    this.#cityRegistry = cityRegistry;
    this.#pathFinderRegistry = pathFinderRegistry;
    this.#strategyNoteRegistry = strategyNoteRegistry;
  }

  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ActiveUnit)) {
      return false;
    }

    const unit = action.value();

    if (!(unit instanceof Settlers)) {
      return false;
    }

    const note = this.#strategyNoteRegistry.getByKey<Tile[]>(
      generateGoodSiteForCityKey(unit.player())
    );

    if (!note) {
      return false;
    }

    const [target] = note
      .value()
      .map((tile): [Tile, number] => [tile, tile.distanceFrom(unit.tile())])
      // TODO: check MAX_TRAVEL_DISTANCE is sufficient
      // TODO: check can pathTo target
      .filter(
        ([, distance]) =>
          distance < MAX_TRAVEL_DISTANCE &&
          goodSiteForCity(
            unit.player(),
            unit.tile(),
            undefined,
            undefined,
            this.#cityRegistry
          )
      )
      .sort(([, distanceA], [, distanceB]) => distanceA - distanceB)
      .map(([tile]) => tile);

    if (!target) {
      return false;
    }

    const goTo = new GoTo(
      unit.tile(),
      target,
      unit,
      this.ruleRegistry(),
      this.#pathFinderRegistry,
      this.#strategyNoteRegistry
    );

    goTo.perform();

    return true;
  }
}

export default MoveToGoodSiteForCity;
