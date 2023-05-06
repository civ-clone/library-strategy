import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import City from '@civ-clone/core-city/City';
import YieldValue from '@civ-clone/core-yield/Yield';
import { PlayerTreasuryRegistry } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
export declare const scoreCity: (
  city: City,
  cityGrowthRegistry?: CityGrowthRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  ruleRegistry?: RuleRegistry,
  unitRegistry?: UnitRegistry
) => number;
export declare const isCityDefended: (
  defendingUnits: number,
  citySize: number
) => boolean;
export declare const canCompleteProduction: (
  city: City,
  YieldType?: typeof YieldValue,
  cityBuildRegistry?: CityBuildRegistry,
  playerTreasuryRegistry?: PlayerTreasuryRegistry,
  ruleRegistry?: RuleRegistry
) => boolean;
