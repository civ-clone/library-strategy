import {
  Aggressive,
  Civilized,
  Expansionist,
  Friendly,
  Militaristic,
} from '@civ-clone/library-civilization/Traits';
import {
  Communism,
  Democracy,
  Despotism,
  Monarchy,
  Republic,
} from '@civ-clone/library-government/Governments';
import {
  Communism as CommunismAdvance,
  Democracy as DemocracyAdvance,
  Monarchy as MonarchyAdvance,
  TheRepublic as RepublicAdvance,
} from '@civ-clone/library-science/Advances';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TraitRegistry,
  instance as traitRegistryInstance,
} from '@civ-clone/core-civilization/TraitRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import {
  playerHasTrait,
  playerHasTraits,
} from '@civ-clone/library-civilization/lib/playerHasTrait';
import Advance from '@civ-clone/core-science/Advance';
import Government from '@civ-clone/core-government/Government';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import PreProcessTurn from '../PlayerActions/PreProcessTurn';
import Strategy from '@civ-clone/core-strategy/Strategy';
import { WomensSuffrage } from '@civ-clone/library-wonder/Wonders';
import { playerHasWonder } from '@civ-clone/library-wonder/lib/playerHasWonder';

const governmentToAdvance = new Map<typeof Government, typeof Advance | null>([
  [Communism, CommunismAdvance],
  [Democracy, DemocracyAdvance],
  [Despotism, null],
  [Monarchy, MonarchyAdvance],
  [Republic, RepublicAdvance],
]);

const supportedGovernments: (typeof Government)[] = [
  Democracy,
  Republic,
  Communism,
  Monarchy,
  Despotism,
];

export class ChangeGovernment extends Strategy {
  #playerGovernmentRegistry: PlayerGovernmentRegistry;
  #traitRegistry: TraitRegistry;
  #wonderRegistry: WonderRegistry;

  constructor(
    playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    traitRegistry: TraitRegistry = traitRegistryInstance,
    wonderRegistry: WonderRegistry = wonderRegistryInstance
  ) {
    super(ruleRegistry);

    this.#playerGovernmentRegistry = playerGovernmentRegistry;
    this.#traitRegistry = traitRegistry;
    this.#wonderRegistry = wonderRegistry;
  }

  attempt(action: PlayerAction): boolean {
    if (!(action instanceof PreProcessTurn)) {
      return false;
    }

    const playerGovernment = this.#playerGovernmentRegistry.getByPlayer(
      action.player()
    );

    return supportedGovernments.some((GovernmentType) => {
      if (playerGovernment.is(GovernmentType)) {
        return true;
      }

      if (
        !playerGovernment.available().includes(GovernmentType) ||
        !this.shouldChooseGovernment(GovernmentType, action.player())
      ) {
        return false;
      }

      playerGovernment.set(new GovernmentType());

      return true;
    });
  }

  shouldChooseGovernment(
    GovernmentType: typeof Government,
    player: Player
  ): boolean {
    if (playerHasTraits(player, Civilized, Friendly, this.#traitRegistry)) {
      return [Communism, Democracy, Despotism, Monarchy, Republic].includes(
        GovernmentType
      );
    }

    if (
      playerHasTrait(player, Civilized, this.#traitRegistry) ||
      playerHasWonder(player, WomensSuffrage, this.#wonderRegistry)
    ) {
      return [Despotism, Monarchy, Republic].includes(GovernmentType);
    }

    if (
      playerHasTraits(player, Aggressive, Militaristic, this.#traitRegistry) ||
      playerHasTraits(player, Aggressive, Expansionist, this.#traitRegistry) ||
      playerHasTraits(player, Militaristic, Expansionist, this.#traitRegistry)
    ) {
      return [Communism, Despotism, Monarchy].includes(GovernmentType);
    }

    return [Despotism, Monarchy].includes(GovernmentType);
  }
}

export default ChangeGovernment;
