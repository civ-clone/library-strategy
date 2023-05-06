import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TraitRegistry } from '@civ-clone/core-civilization/TraitRegistry';
import Advance from '@civ-clone/core-science/Advance';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
declare global {
  interface ChoiceMetaDataMap {
    'capture-city.steal-advance': typeof Advance;
    'choose-research': typeof Advance;
    'diplomacy.exchange-knowledge': typeof Advance;
  }
}
export declare class ChooseResearchFromList extends Strategy {
  #private;
  constructor(
    handledKeys?: (keyof ChoiceMetaDataMap)[],
    ruleRegistry?: RuleRegistry,
    traitRegistry?: TraitRegistry,
    randomNumberGenerator?: () => number
  );
  attempt(action: PlayerAction): boolean;
  private pickRandomFromList;
}
export default ChooseResearchFromList;
