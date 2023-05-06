import Player from '@civ-clone/core-player/Player';
import { InteractionRegistry } from '@civ-clone/core-diplomacy/InteractionRegistry';
export declare const shouldAttackPlayer: (
  player: Player,
  enemy: Player,
  interactionRegistry?: InteractionRegistry
) => boolean;
