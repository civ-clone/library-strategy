import {
  ChangeProduction,
  CityBuild,
} from '@civ-clone/core-city-build/PlayerActions';
import { Defence, Movement } from '@civ-clone/core-unit/Yields';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import { Land } from '@civ-clone/library-unit/Types';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
import Unit from '@civ-clone/core-unit/Unit';
import { unitTypeYieldValue } from '../lib/unitDetails';

export class BuildExplorer extends Strategy {
  #UnitType: typeof Unit;

  constructor(
    UnitType: typeof Unit = Land,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super(ruleRegistry);

    this.#UnitType = UnitType;
  }

  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ChangeProduction || action instanceof CityBuild)) {
      return false;
    }

    const cityBuild = action.value(),
      [strongestDefender] = cityBuild
        .available()
        .filter((buildItem) =>
          Object.prototype.isPrototypeOf.call(this.#UnitType, buildItem.item())
        )
        .sort(
          (buildItemA, buildItemB) =>
            // Order by highest `Movement`...
            unitTypeYieldValue(buildItemB.item() as typeof Unit, Movement) -
              unitTypeYieldValue(buildItemA.item() as typeof Unit, Movement) ||
            // ...and highest `Defence`.
            unitTypeYieldValue(buildItemB.item() as typeof Unit, Defence) -
              unitTypeYieldValue(buildItemA.item() as typeof Unit, Defence)
        );

    cityBuild.build(strongestDefender.item());

    return true;
  }
}

export default BuildExplorer;
