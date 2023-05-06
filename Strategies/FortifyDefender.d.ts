import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { UnitImprovementRegistry } from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
export declare class FortifyDefender extends Strategy {
  #private;
  constructor(
    cityGrowthRegistry?: CityGrowthRegistry,
    cityRegistry?: CityRegistry,
    ruleRegistry?: RuleRegistry,
    unitImprovementRegistry?: UnitImprovementRegistry,
    unitRegistry?: UnitRegistry
  );
  attempt(action: PlayerAction): boolean;
}
export default FortifyDefender;
