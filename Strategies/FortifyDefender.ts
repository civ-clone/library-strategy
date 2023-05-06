import {
  ActiveUnit,
  InactiveUnit,
} from '@civ-clone/library-unit/PlayerActions';
import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  UnitImprovementRegistry,
  instance as unitImprovementRegistryInstance,
} from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import { Fortify } from '@civ-clone/library-unit/Actions';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
import Unit from '@civ-clone/core-unit/Unit';
import { isCityDefended } from '../lib/cityDetails';
import { isCityDefender } from '../lib/unitDetails';

export class FortifyDefender extends Strategy {
  #cityGrowthRegistry: CityGrowthRegistry;
  #cityRegistry: CityRegistry;
  #unitRegistry: UnitRegistry;
  #unitImprovementRegistry: UnitImprovementRegistry;

  constructor(
    cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
    cityRegistry: CityRegistry = cityRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    unitImprovementRegistry: UnitImprovementRegistry = unitImprovementRegistryInstance,
    unitRegistry: UnitRegistry = unitRegistryInstance
  ) {
    super(ruleRegistry);

    this.#cityRegistry = cityRegistry;
    this.#cityGrowthRegistry = cityGrowthRegistry;
    this.#unitImprovementRegistry = unitImprovementRegistry;
    this.#unitRegistry = unitRegistry;
  }

  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ActiveUnit || action instanceof InactiveUnit)) {
      return false;
    }

    const unit: Unit = action.value(),
      tileCity = this.#cityRegistry.getByTile(unit.tile());

    if (!tileCity) {
      return false;
    }

    const defendingUnits = this.#unitRegistry
        .getByTile(tileCity.tile())
        .filter((unit) =>
          isCityDefender(
            unit,
            this.ruleRegistry(),
            this.#unitImprovementRegistry
          )
        ),
      cityGrowth = this.#cityGrowthRegistry.getByCity(tileCity);

    if (isCityDefended(defendingUnits.length, cityGrowth.size())) {
      return false;
    }

    const [fortify] = unit
      .actions()
      .filter((action) => action instanceof Fortify);

    if (!fortify) {
      return false;
    }

    fortify.perform();

    return true;
  }
}

export default FortifyDefender;
