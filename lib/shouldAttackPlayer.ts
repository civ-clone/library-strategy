import Player from '@civ-clone/core-player/Player';
import {
  InteractionRegistry,
  instance as interactionRegistryInstance,
} from '@civ-clone/core-diplomacy/InteractionRegistry';

export const shouldAttackPlayer = (
  player: Player,
  enemy: Player,
  interactionRegistry: InteractionRegistry = interactionRegistryInstance
) => false;
