import {
  ActiveUnit,
  InactiveUnit,
} from '@civ-clone/library-unit/PlayerActions';
import {
  Attack,
  BuildIrrigation,
  BuildMine,
  BuildRoad,
  CaptureCity,
  Disembark,
  Embark,
  Fortify,
  FoundCity,
  Move,
  NoOrders,
  SneakAttack,
  SneakCaptureCity,
  Unload,
} from '@civ-clone/library-unit/Actions';
import { Fortifiable, NavalTransport } from '@civ-clone/library-unit/Types';
import {
  GoodyHutRegistry,
  instance as goodyHutRegistryInstance,
} from '@civ-clone/core-goody-hut/GoodyHutRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  StrategyNoteRegistry,
  instance as strategyNoteRegistryInstance,
} from '@civ-clone/core-strategy/StrategyNoteRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import Action from '@civ-clone/core-unit/Action';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
import Tile from '@civ-clone/core-world/Tile';
import { Trireme } from '@civ-clone/library-unit/Units/Trireme';
import Unit from '@civ-clone/core-unit/Unit';
import { shouldAttackPlayer } from '../lib/shouldAttackPlayer';
import { generateKey } from '@civ-clone/core-strategy/StrategyNote';
import { isTransport } from '@civ-clone/core-unit-transport/Transport';
import { Transport } from '@civ-clone/library-unit/Units';

type ActionLookup = {
  attack?: Attack;
  buildIrrigation?: BuildIrrigation;
  buildMine?: BuildMine;
  buildRoad?: BuildRoad;
  captureCity?: CaptureCity;
  disembark?: Disembark;
  embark?: Embark;
  fortify?: Fortify;
  foundCity?: FoundCity;
  noOrders?: NoOrders;
  sneakAttack?: SneakAttack;
  unload?: Unload;
};

const MAX_LAST_MOVES: number = 50;

/**
 * This is mostly copied as-is from `SimpleAIClient` and could probably do with being re-worked entirely.
 */
export class MoveToExploreMap extends Strategy {
  #goodyHutRegistry: GoodyHutRegistry;
  #playerWorldRegistry: PlayerWorldRegistry;
  #strategyNoteRegistry: StrategyNoteRegistry;
  #unitRegistry: UnitRegistry;

  constructor(
    goodyHutRegistry: GoodyHutRegistry = goodyHutRegistryInstance,
    playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    strategyNoteRegistry: StrategyNoteRegistry = strategyNoteRegistryInstance,
    unitRegistry: UnitRegistry = unitRegistryInstance
  ) {
    super(ruleRegistry);

    this.#goodyHutRegistry = goodyHutRegistry;
    this.#playerWorldRegistry = playerWorldRegistry;
    this.#strategyNoteRegistry = strategyNoteRegistry;
    this.#unitRegistry = unitRegistry;
  }
  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ActiveUnit || action instanceof InactiveUnit)) {
      return false;
    }

    const unit = action.value();

    const [target] = unit
      .tile()
      .getNeighbours()
      .concat([unit.tile()])
      .map((tile: Tile): [Tile, number] => [
        tile,
        this.scoreUnitMove(unit, tile),
      ])
      .filter(([, score]: [Tile, number]): boolean => score > -1)
      .sort(
        ([, a]: [Tile, number], [, b]: [Tile, number]): number =>
          b - a ||
          // if there's no difference, sort randomly
          Math.floor(Math.random() * 3) - 1
      )
      .map(([tile]: [Tile, number]): Tile => tile);

    if (!target) {
      return false;
    }

    const actions = unit.actions(target),
      [unitAction] = actions.filter(
        (action) => action instanceof Move || action instanceof Unload
      ),
      lastMovesNote = this.#strategyNoteRegistry.getOrCreateByKey<Tile[]>(
        generateKey(unit, 'lastMoves'),
        []
      ),
      lastMoves = lastMovesNote.value();

    if (
      !unitAction ||
      ((unitAction instanceof SneakAttack ||
        unitAction instanceof SneakCaptureCity) &&
        !shouldAttackPlayer(unit.player(), unitAction.enemy()))
    ) {
      return false;
    }

    lastMoves.push(target);

    if (lastMoves.length > MAX_LAST_MOVES) {
      lastMoves.splice(0, lastMoves.length - MAX_LAST_MOVES);
    }

    unit.action(unitAction!);

    return true;
  }

  private scoreUnitMove(unit: Unit, tile: Tile): number {
    const actions = unit.actions(tile),
      {
        attack,
        captureCity,
        disembark,
        embark,
        fortify,
        noOrders,
        sneakAttack,
      } = actions.reduce(
        (object: ActionLookup, entity: Action): ActionLookup => ({
          ...object,
          [entity.constructor.name.replace(/^./, (char: string): string =>
            char.toLowerCase()
          )]: entity,
        }),
        {}
      );

    if (
      sneakAttack &&
      !shouldAttackPlayer(unit.player(), sneakAttack.enemy())
    ) {
      return -10;
    }

    if (
      !actions.length ||
      (actions.length === 1 && noOrders) ||
      (unit instanceof Fortifiable &&
        actions.length === 2 &&
        fortify &&
        noOrders)
    ) {
      return -1;
    }

    let score = 0;

    const goodyHut = this.#goodyHutRegistry.getByTile(tile);

    if (goodyHut !== null) {
      score += 60;
    }

    const tileUnits = this.#unitRegistry
        .getByTile(tile)
        .sort(
          (a: Unit, b: Unit): number =>
            b.defence().value() - a.defence().value()
        ),
      [defender] = tileUnits,
      ourUnitsOnTile = tileUnits.some(
        (unit: Unit) => unit.player() === unit.player()
      );

    if (
      isTransport(unit) &&
      (unit as Transport).hasCapacity() &&
      (unit as Transport).hasCargo() &&
      tile === unit.tile() &&
      tile.getNeighbours().some((tile) => tile.isCoast())
      // and at least some of the cargo are able to disembark to a new continent
    ) {
      score += 40;
    }

    if (
      unit instanceof Trireme &&
      unit.hasCargo() &&
      (!tile
        .getSurroundingArea(unit.moves().value() - 1)
        .some((tile) => tile.isCoast()) ||
        (unit.moves().value() === 1 && !tile.isCoast()))
    ) {
      return -1;
    }

    // if (
    //   unit instanceof NavalTransport &&
    //   unit.hasCargo() &&
    //   tile.isCoast() &&
    //   tile.isWater()
    // ) {
    //   score += 16;
    // }

    if (embark) {
      score += 16;
    }

    // TODO: move to far off continents
    if (disembark /* && tile.continentId !== unit.departureContinentId*/) {
      score += 16;
    }

    if (captureCity) {
      score += 100;
    }

    // TODO: weight attacking dependent on leader's personality
    if (attack && unit.attack() > defender.defence()) {
      score += 24 * (unit.attack().value() - defender.defence().value());
    }

    if (attack && unit.attack().value() >= defender.defence().value()) {
      score += 16;
    }

    // add some jeopardy
    if (
      attack &&
      unit.attack().value() >= defender.defence().value() * (2 / 3)
    ) {
      score += 8;
    }

    const playerWorld = this.#playerWorldRegistry.getByPlayer(unit.player());

    const discoverableTiles = tile
      .getNeighbours()
      .filter(
        (neighbouringTile: Tile): boolean =>
          !playerWorld.includes(neighbouringTile)
      ).length;

    score += discoverableTiles * 3;

    const lastMovesNote = this.#strategyNoteRegistry.getOrCreateByKey<Tile[]>(
      generateKey(unit, 'lastMoves'),
      []
    );

    if (!lastMovesNote.value().includes(tile)) {
      score *= 4;
    }

    return score;
  }
}

export default MoveToExploreMap;
