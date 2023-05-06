import { PlayerTreasuryRegistry } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
export declare class BuyDefender extends Strategy {
  #private;
  constructor(
    playerTreasuryRegistry?: PlayerTreasuryRegistry,
    ruleRegistry?: RuleRegistry
  );
  attempt(action: PlayerAction): boolean;
}
export default BuyDefender;
