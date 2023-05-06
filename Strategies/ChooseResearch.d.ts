import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { StrategyRegistry } from '@civ-clone/core-strategy/StrategyRegistry';
import { TraitRegistry } from '@civ-clone/core-civilization/TraitRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
export declare class ChooseResearch extends Strategy {
  #private;
  constructor(
    ruleRegistry?: RuleRegistry,
    strategyRegistry?: StrategyRegistry,
    traitRegistry?: TraitRegistry,
    randomNumberGenerator?: () => number
  );
  attempt(action: PlayerAction): boolean;
}
export default ChooseResearch;
