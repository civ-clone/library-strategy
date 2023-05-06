import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { PathFinderRegistry } from '@civ-clone/core-world-path/PathFinderRegistry';
import { PlayerTreasuryRegistry } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { StrategyNoteRegistry } from '@civ-clone/core-strategy/StrategyNoteRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import { UnitImprovementRegistry } from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
export declare class CheckForUndefendedCities extends Strategy {
  #private;
  constructor(
    cityBuildRegistry?: CityBuildRegistry,
    cityGrowthRegistry?: CityGrowthRegistry,
    cityRegistry?: CityRegistry,
    pathFinderRegistry?: PathFinderRegistry,
    playerTreasuryRegistry?: PlayerTreasuryRegistry,
    ruleRegistry?: RuleRegistry,
    strategyNoteRegistry?: StrategyNoteRegistry,
    tileImprovementRegistry?: TileImprovementRegistry,
    unitImprovementRegistry?: UnitImprovementRegistry,
    unitRegistry?: UnitRegistry
  );
  attempt(action: PlayerAction): boolean;
}
export default CheckForUndefendedCities;
