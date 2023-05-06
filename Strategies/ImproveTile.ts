import {
  ActiveUnit,
  InactiveUnit,
} from '@civ-clone/library-unit/PlayerActions';
import {
  BuildIrrigation,
  BuildMine,
  BuildRoad,
  BuildRailroad,
} from '@civ-clone/library-unit/Actions';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import {
  shouldIrrigate,
  shouldMine,
  shouldRailroad,
  shouldRoad,
} from '../lib/tileDetails';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
import { Worker } from '@civ-clone/library-unit/Types';
import { unitCanActionAtTile } from '../lib/unitDetails';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';

export class ImproveTile extends Strategy {
  #cityRegistry: CityRegistry;
  #tileImprovementRegistry: TileImprovementRegistry;

  constructor(
    cityRegistry: CityRegistry = cityRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
  ) {
    super(ruleRegistry);

    this.#cityRegistry = cityRegistry;
    this.#tileImprovementRegistry = tileImprovementRegistry;
  }

  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ActiveUnit || action instanceof InactiveUnit)) {
      return false;
    }

    const unit = action.value();

    if (!(unit instanceof Worker)) {
      return false;
    }

    if (
      !(
        shouldIrrigate(
          unit.tile(),
          unit.player(),
          this.#cityRegistry,
          this.#tileImprovementRegistry
        ) ||
        shouldMine(
          unit.tile(),
          unit.player(),
          this.#cityRegistry,
          this.#tileImprovementRegistry
        ) ||
        shouldRoad(
          unit.tile(),
          unit.player(),
          this.#cityRegistry,
          this.#tileImprovementRegistry
        ) ||
        shouldRailroad(
          unit.tile(),
          unit.player(),
          this.#cityRegistry,
          this.#tileImprovementRegistry
        )
      ) ||
      !(
        unitCanActionAtTile(unit, BuildIrrigation) ||
        unitCanActionAtTile(unit, BuildMine) ||
        unitCanActionAtTile(unit, BuildRoad) ||
        unitCanActionAtTile(unit, BuildRailroad)
      )
    ) {
      return false;
    }

    return [BuildIrrigation, BuildMine, BuildRoad, BuildRailroad].some(
      (ActionType) => {
        const [action] = unit
          .actions()
          .filter((action) => action instanceof ActionType);

        if (!action) {
          return false;
        }

        action.perform();

        return true;
      }
    );
  }
}

export default ImproveTile;
