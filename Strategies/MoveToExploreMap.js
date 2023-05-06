"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MoveToExploreMap_goodyHutRegistry, _MoveToExploreMap_playerWorldRegistry, _MoveToExploreMap_strategyNoteRegistry, _MoveToExploreMap_unitRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveToExploreMap = void 0;
const PlayerActions_1 = require("@civ-clone/library-unit/PlayerActions");
const Actions_1 = require("@civ-clone/library-unit/Actions");
const Types_1 = require("@civ-clone/library-unit/Types");
const GoodyHutRegistry_1 = require("@civ-clone/core-goody-hut/GoodyHutRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const StrategyNoteRegistry_1 = require("@civ-clone/core-strategy/StrategyNoteRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
const Trireme_1 = require("@civ-clone/library-unit/Units/Trireme");
const shouldAttackPlayer_1 = require("../lib/shouldAttackPlayer");
const StrategyNote_1 = require("@civ-clone/core-strategy/StrategyNote");
const Transport_1 = require("@civ-clone/core-unit-transport/Transport");
const MAX_LAST_MOVES = 50;
/**
 * This is mostly copied as-is from `SimpleAIClient` and could probably do with being re-worked entirely.
 */
class MoveToExploreMap extends Strategy_1.default {
    constructor(goodyHutRegistry = GoodyHutRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, strategyNoteRegistry = StrategyNoteRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) {
        super(ruleRegistry);
        _MoveToExploreMap_goodyHutRegistry.set(this, void 0);
        _MoveToExploreMap_playerWorldRegistry.set(this, void 0);
        _MoveToExploreMap_strategyNoteRegistry.set(this, void 0);
        _MoveToExploreMap_unitRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _MoveToExploreMap_goodyHutRegistry, goodyHutRegistry, "f");
        __classPrivateFieldSet(this, _MoveToExploreMap_playerWorldRegistry, playerWorldRegistry, "f");
        __classPrivateFieldSet(this, _MoveToExploreMap_strategyNoteRegistry, strategyNoteRegistry, "f");
        __classPrivateFieldSet(this, _MoveToExploreMap_unitRegistry, unitRegistry, "f");
    }
    attempt(action) {
        if (!(action instanceof PlayerActions_1.ActiveUnit || action instanceof PlayerActions_1.InactiveUnit)) {
            return false;
        }
        const unit = action.value();
        const [target] = unit
            .tile()
            .getNeighbours()
            .concat([unit.tile()])
            .map((tile) => [
            tile,
            this.scoreUnitMove(unit, tile),
        ])
            .filter(([, score]) => score > -1)
            .sort(([, a], [, b]) => b - a ||
            // if there's no difference, sort randomly
            Math.floor(Math.random() * 3) - 1)
            .map(([tile]) => tile);
        if (!target) {
            return false;
        }
        const actions = unit.actions(target), [unitAction] = actions.filter((action) => action instanceof Actions_1.Move || action instanceof Actions_1.Unload), lastMovesNote = __classPrivateFieldGet(this, _MoveToExploreMap_strategyNoteRegistry, "f").getOrCreateByKey((0, StrategyNote_1.generateKey)(unit, 'lastMoves'), []), lastMoves = lastMovesNote.value();
        if (!unitAction ||
            ((unitAction instanceof Actions_1.SneakAttack ||
                unitAction instanceof Actions_1.SneakCaptureCity) &&
                !(0, shouldAttackPlayer_1.shouldAttackPlayer)(unit.player(), unitAction.enemy()))) {
            return false;
        }
        lastMoves.push(target);
        if (lastMoves.length > MAX_LAST_MOVES) {
            lastMoves.splice(0, lastMoves.length - MAX_LAST_MOVES);
        }
        unit.action(unitAction);
        return true;
    }
    scoreUnitMove(unit, tile) {
        const actions = unit.actions(tile), { attack, captureCity, disembark, embark, fortify, noOrders, sneakAttack, } = actions.reduce((object, entity) => ({
            ...object,
            [entity.constructor.name.replace(/^./, (char) => char.toLowerCase())]: entity,
        }), {});
        if (sneakAttack &&
            !(0, shouldAttackPlayer_1.shouldAttackPlayer)(unit.player(), sneakAttack.enemy())) {
            return -10;
        }
        if (!actions.length ||
            (actions.length === 1 && noOrders) ||
            (unit instanceof Types_1.Fortifiable &&
                actions.length === 2 &&
                fortify &&
                noOrders)) {
            return -1;
        }
        let score = 0;
        const goodyHut = __classPrivateFieldGet(this, _MoveToExploreMap_goodyHutRegistry, "f").getByTile(tile);
        if (goodyHut !== null) {
            score += 60;
        }
        const tileUnits = __classPrivateFieldGet(this, _MoveToExploreMap_unitRegistry, "f")
            .getByTile(tile)
            .sort((a, b) => b.defence().value() - a.defence().value()), [defender] = tileUnits, ourUnitsOnTile = tileUnits.some((unit) => unit.player() === unit.player());
        if ((0, Transport_1.isTransport)(unit) &&
            unit.hasCapacity() &&
            unit.hasCargo() &&
            tile === unit.tile() &&
            tile.getNeighbours().some((tile) => tile.isCoast())
        // and at least some of the cargo are able to disembark to a new continent
        ) {
            score += 40;
        }
        if (unit instanceof Trireme_1.Trireme &&
            unit.hasCargo() &&
            (!tile
                .getSurroundingArea(unit.moves().value() - 1)
                .some((tile) => tile.isCoast()) ||
                (unit.moves().value() === 1 && !tile.isCoast()))) {
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
        if (attack &&
            unit.attack().value() >= defender.defence().value() * (2 / 3)) {
            score += 8;
        }
        const playerWorld = __classPrivateFieldGet(this, _MoveToExploreMap_playerWorldRegistry, "f").getByPlayer(unit.player());
        const discoverableTiles = tile
            .getNeighbours()
            .filter((neighbouringTile) => !playerWorld.includes(neighbouringTile)).length;
        score += discoverableTiles * 3;
        const lastMovesNote = __classPrivateFieldGet(this, _MoveToExploreMap_strategyNoteRegistry, "f").getOrCreateByKey((0, StrategyNote_1.generateKey)(unit, 'lastMoves'), []);
        if (!lastMovesNote.value().includes(tile)) {
            score *= 4;
        }
        return score;
    }
}
exports.MoveToExploreMap = MoveToExploreMap;
_MoveToExploreMap_goodyHutRegistry = new WeakMap(), _MoveToExploreMap_playerWorldRegistry = new WeakMap(), _MoveToExploreMap_strategyNoteRegistry = new WeakMap(), _MoveToExploreMap_unitRegistry = new WeakMap();
exports.default = MoveToExploreMap;
//# sourceMappingURL=MoveToExploreMap.js.map