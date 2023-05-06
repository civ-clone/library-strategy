import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
export declare class ImproveTile extends Strategy {
  #private;
  constructor(
    cityRegistry?: CityRegistry,
    ruleRegistry?: RuleRegistry,
    tileImprovementRegistry?: TileImprovementRegistry
  );
  attempt(action: PlayerAction): boolean;
}
export default ImproveTile;
