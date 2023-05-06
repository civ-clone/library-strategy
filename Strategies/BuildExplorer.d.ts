import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
import Unit from '@civ-clone/core-unit/Unit';
export declare class BuildExplorer extends Strategy {
  #private;
  constructor(UnitType?: typeof Unit, ruleRegistry?: RuleRegistry);
  attempt(action: PlayerAction): boolean;
}
export default BuildExplorer;
