import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
export declare class BuildSettlers extends Strategy {
  #private;
  constructor(
    cityGrowthRegistry?: CityGrowthRegistry,
    ruleRegistry?: RuleRegistry,
    unitRegistry?: UnitRegistry
  );
  attempt(action: PlayerAction): boolean;
}
export default BuildSettlers;
