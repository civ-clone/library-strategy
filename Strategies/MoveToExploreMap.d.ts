import { GoodyHutRegistry } from '@civ-clone/core-goody-hut/GoodyHutRegistry';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { StrategyNoteRegistry } from '@civ-clone/core-strategy/StrategyNoteRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
/**
 * This is mostly copied as-is from `SimpleAIClient` and could probably do with being re-worked entirely.
 */
export declare class MoveToExploreMap extends Strategy {
  #private;
  constructor(
    goodyHutRegistry?: GoodyHutRegistry,
    playerWorldRegistry?: PlayerWorldRegistry,
    ruleRegistry?: RuleRegistry,
    strategyNoteRegistry?: StrategyNoteRegistry,
    unitRegistry?: UnitRegistry
  );
  attempt(action: PlayerAction): boolean;
  private scoreUnitMove;
}
export default MoveToExploreMap;
