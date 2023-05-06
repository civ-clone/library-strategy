import { BuildRoad, BuildRailroad } from '@civ-clone/library-unit/Actions';
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
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import { generateKey as generateGoodSiteForCityKey } from '../lib/goodSiteForCity';
import {
  shouldIrrigate,
  shouldMine,
  shouldRailroad,
  shouldRoad,
} from '../lib/tileDetails';
import ActiveUnit from '@civ-clone/base-player-action-active-unit/ActiveUnit';
import { GoTo } from '@civ-clone/library-unit/Actions';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import { Settlers } from '@civ-clone/library-unit/Units';
import Strategy from '@civ-clone/core-strategy/Strategy';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import { unitCanActionAtTile } from '../lib/unitDetails';

const MAX_TRAVEL_DISTANCE = 15;

const tileImprovementScore = (
  tile: Tile,
  unit: Unit,
  cityRegistry: CityRegistry = cityRegistryInstance,
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
) =>
  (shouldIrrigate(tile, unit.player(), cityRegistry, tileImprovementRegistry)
    ? 1
    : 0) +
  (shouldMine(tile, unit.player(), cityRegistry, tileImprovementRegistry)
    ? 1
    : 0) +
  (shouldRoad(tile, unit.player(), cityRegistry, tileImprovementRegistry) &&
  unitCanActionAtTile(unit, BuildRoad, tile, tile)
    ? 1
    : 0) +
  (shouldRailroad(tile, unit.player(), cityRegistry, tileImprovementRegistry) &&
  unitCanActionAtTile(unit, BuildRailroad, tile, tile)
    ? 1
    : 0);

export class MoveToTileToImprove extends Strategy {
  #cityRegistry: CityRegistry;
  #pathFinderRegistry: PathFinderRegistry;
  #strategyNoteRegistry: StrategyNoteRegistry;
  #tileImprovementRegistry: TileImprovementRegistry;

  constructor(
    cityRegistry: CityRegistry = cityRegistryInstance,
    pathFinderRegistry: PathFinderRegistry = pathFinderRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    strategyNoteRegistry: StrategyNoteRegistry = strategyNoteRegistryInstance,
    tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
  ) {
    super(ruleRegistry);

    this.#cityRegistry = cityRegistry;
    this.#pathFinderRegistry = pathFinderRegistry;
    this.#strategyNoteRegistry = strategyNoteRegistry;
    this.#tileImprovementRegistry = tileImprovementRegistry;
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

    const [target] = this.#cityRegistry
      .getByPlayer(unit.player())
      .flatMap((city) => city.tiles().entries())
      .map((tile): [Tile, number] => [tile, tile.distanceFrom(unit.tile())])
      // TODO: check MAX_TRAVEL_DISTANCE is sufficient
      // TODO: check can pathTo target
      .filter(
        ([tile, distance]) =>
          distance < MAX_TRAVEL_DISTANCE &&
          tileImprovementScore(
            tile,
            unit,
            this.#cityRegistry,
            this.#tileImprovementRegistry
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

export default MoveToTileToImprove;
