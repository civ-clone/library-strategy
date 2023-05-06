import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
export declare class DoNothingWithUnit extends Strategy {
  attempt(action: PlayerAction): boolean;
}
export default DoNothingWithUnit;
