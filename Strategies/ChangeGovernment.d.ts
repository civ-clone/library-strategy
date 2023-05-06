import { PlayerGovernmentRegistry } from '@civ-clone/core-government/PlayerGovernmentRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TraitRegistry } from '@civ-clone/core-civilization/TraitRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import Government from '@civ-clone/core-government/Government';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
export declare class ChangeGovernment extends Strategy {
  #private;
  constructor(
    playerGovernmentRegistry?: PlayerGovernmentRegistry,
    ruleRegistry?: RuleRegistry,
    traitRegistry?: TraitRegistry,
    wonderRegistry?: WonderRegistry
  );
  attempt(action: PlayerAction): boolean;
  shouldChooseGovernment(
    GovernmentType: typeof Government,
    player: Player
  ): boolean;
}
export default ChangeGovernment;
