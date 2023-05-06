import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
export declare class BuildCity extends Strategy {
  #private;
  constructor(cityRegistry?: CityRegistry, ruleRegistry?: RuleRegistry);
  attempt(playerAction: PlayerAction): boolean;
}
export default BuildCity;
