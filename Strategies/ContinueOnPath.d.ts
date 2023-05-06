import { PathFinderRegistry } from '@civ-clone/core-world-path/PathFinderRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { StrategyNoteRegistry } from '@civ-clone/core-strategy/StrategyNoteRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
import Strategy from '@civ-clone/core-strategy/Strategy';
export declare class ContinueOnPath extends Strategy {
  #private;
  constructor(
    pathFinderRegistry?: PathFinderRegistry,
    ruleRegistry?: RuleRegistry,
    strategyNoteRegistry?: StrategyNoteRegistry
  );
  attempt(action: PlayerAction): boolean;
  /**
   * Fixed, really high, `Priority` to handle this scenario before anything else
   */
  priority(action: PlayerAction): Priority;
}
export default ContinueOnPath;
