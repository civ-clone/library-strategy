import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { PathFinderRegistry } from '@civ-clone/core-world-path/PathFinderRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { StrategyNoteRegistry } from '@civ-clone/core-strategy/StrategyNoteRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
export declare class MoveToGoodSiteForCity extends Strategy {
  #private;
  constructor(
    cityRegistry?: CityRegistry,
    pathFinderRegistry?: PathFinderRegistry,
    ruleRegistry?: RuleRegistry,
    strategyNoteRegistry?: StrategyNoteRegistry
  );
  attempt(action: PlayerAction): boolean;
}
export default MoveToGoodSiteForCity;
