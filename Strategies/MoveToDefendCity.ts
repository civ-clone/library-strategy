import {
  ActiveUnit,
  InactiveUnit,
} from '@civ-clone/library-unit/PlayerActions';
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
import { unitYieldValue, canPathTo } from '../lib/unitDetails';
import City from '@civ-clone/core-city/City';
import { Defence } from '@civ-clone/core-unit/Yields';
import { GoTo } from '@civ-clone/library-unit/Actions';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';

export class MoveToDefendCity extends Strategy {
  #city: City;
  #maxTravelDistance: number;
  #pathFinderRegistry: PathFinderRegistry;
  #strategyNoteRegistry: StrategyNoteRegistry;

  constructor(
    city: City,
    maxTravelDistance: number = 15,
    pathFinderRegistry: PathFinderRegistry = pathFinderRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    strategyNoteRegistry: StrategyNoteRegistry = strategyNoteRegistryInstance
  ) {
    super(ruleRegistry);

    this.#city = city;
    this.#maxTravelDistance = maxTravelDistance;
    this.#pathFinderRegistry = pathFinderRegistry;
    this.#strategyNoteRegistry = strategyNoteRegistry;
  }

  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ActiveUnit || action instanceof InactiveUnit)) {
      return false;
    }

    const unit = action.value();

    if (
      !unitYieldValue(unit, Defence, this.ruleRegistry()) ||
      !canPathTo(unit, this.#city.tile(), this.#pathFinderRegistry) ||
      unit.tile().distanceFrom(this.#city.tile()) > this.#maxTravelDistance
    ) {
      return false;
    }

    const goTo = new GoTo(
      unit.tile(),
      this.#city.tile(),
      unit,
      this.ruleRegistry(),
      this.#pathFinderRegistry,
      this.#strategyNoteRegistry
    );

    goTo.perform();

    return true;
  }
}

export default MoveToDefendCity;
