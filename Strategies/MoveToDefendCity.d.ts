import { PathFinderRegistry } from '@civ-clone/core-world-path/PathFinderRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { StrategyNoteRegistry } from '@civ-clone/core-strategy/StrategyNoteRegistry';
import City from '@civ-clone/core-city/City';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
export declare class MoveToDefendCity extends Strategy {
  #private;
  constructor(
    city: City,
    maxTravelDistance?: number,
    pathFinderRegistry?: PathFinderRegistry,
    ruleRegistry?: RuleRegistry,
    strategyNoteRegistry?: StrategyNoteRegistry
  );
  attempt(action: PlayerAction): boolean;
}
export default MoveToDefendCity;
