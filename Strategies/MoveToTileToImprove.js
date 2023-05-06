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
var _MoveToTileToImprove_cityRegistry, _MoveToTileToImprove_pathFinderRegistry, _MoveToTileToImprove_strategyNoteRegistry, _MoveToTileToImprove_tileImprovementRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveToTileToImprove = void 0;
const Actions_1 = require("@civ-clone/library-unit/Actions");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const PathFinderRegistry_1 = require("@civ-clone/core-world-path/PathFinderRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const StrategyNoteRegistry_1 = require("@civ-clone/core-strategy/StrategyNoteRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const goodSiteForCity_1 = require("../lib/goodSiteForCity");
const tileDetails_1 = require("../lib/tileDetails");
const ActiveUnit_1 = require("@civ-clone/base-player-action-active-unit/ActiveUnit");
const Actions_2 = require("@civ-clone/library-unit/Actions");
const Units_1 = require("@civ-clone/library-unit/Units");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
const unitDetails_1 = require("../lib/unitDetails");
const MAX_TRAVEL_DISTANCE = 15;
const tileImprovementScore = (tile, unit, cityRegistry = CityRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) => ((0, tileDetails_1.shouldIrrigate)(tile, unit.player(), cityRegistry, tileImprovementRegistry)
    ? 1
    : 0) +
    ((0, tileDetails_1.shouldMine)(tile, unit.player(), cityRegistry, tileImprovementRegistry)
        ? 1
        : 0) +
    ((0, tileDetails_1.shouldRoad)(tile, unit.player(), cityRegistry, tileImprovementRegistry) &&
        (0, unitDetails_1.unitCanActionAtTile)(unit, Actions_1.BuildRoad, tile, tile)
        ? 1
        : 0) +
    ((0, tileDetails_1.shouldRailroad)(tile, unit.player(), cityRegistry, tileImprovementRegistry) &&
        (0, unitDetails_1.unitCanActionAtTile)(unit, Actions_1.BuildRailroad, tile, tile)
        ? 1
        : 0);
class MoveToTileToImprove extends Strategy_1.default {
    constructor(cityRegistry = CityRegistry_1.instance, pathFinderRegistry = PathFinderRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, strategyNoteRegistry = StrategyNoteRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) {
        super(ruleRegistry);
        _MoveToTileToImprove_cityRegistry.set(this, void 0);
        _MoveToTileToImprove_pathFinderRegistry.set(this, void 0);
        _MoveToTileToImprove_strategyNoteRegistry.set(this, void 0);
        _MoveToTileToImprove_tileImprovementRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _MoveToTileToImprove_cityRegistry, cityRegistry, "f");
        __classPrivateFieldSet(this, _MoveToTileToImprove_pathFinderRegistry, pathFinderRegistry, "f");
        __classPrivateFieldSet(this, _MoveToTileToImprove_strategyNoteRegistry, strategyNoteRegistry, "f");
        __classPrivateFieldSet(this, _MoveToTileToImprove_tileImprovementRegistry, tileImprovementRegistry, "f");
    }
    attempt(action) {
        if (!(action instanceof ActiveUnit_1.default)) {
            return false;
        }
        const unit = action.value();
        if (!(unit instanceof Units_1.Settlers)) {
            return false;
        }
        const note = __classPrivateFieldGet(this, _MoveToTileToImprove_strategyNoteRegistry, "f").getByKey((0, goodSiteForCity_1.generateKey)(unit.player()));
        if (!note) {
            return false;
        }
        const [target] = __classPrivateFieldGet(this, _MoveToTileToImprove_cityRegistry, "f")
            .getByPlayer(unit.player())
            .flatMap((city) => city.tiles().entries())
            .map((tile) => [tile, tile.distanceFrom(unit.tile())])
            // TODO: check MAX_TRAVEL_DISTANCE is sufficient
            // TODO: check can pathTo target
            .filter(([tile, distance]) => distance < MAX_TRAVEL_DISTANCE &&
            tileImprovementScore(tile, unit, __classPrivateFieldGet(this, _MoveToTileToImprove_cityRegistry, "f"), __classPrivateFieldGet(this, _MoveToTileToImprove_tileImprovementRegistry, "f")))
            .sort(([, distanceA], [, distanceB]) => distanceA - distanceB)
            .map(([tile]) => tile);
        if (!target) {
            return false;
        }
        const goTo = new Actions_2.GoTo(unit.tile(), target, unit, this.ruleRegistry(), __classPrivateFieldGet(this, _MoveToTileToImprove_pathFinderRegistry, "f"), __classPrivateFieldGet(this, _MoveToTileToImprove_strategyNoteRegistry, "f"));
        goTo.perform();
        return true;
    }
}
exports.MoveToTileToImprove = MoveToTileToImprove;
_MoveToTileToImprove_cityRegistry = new WeakMap(), _MoveToTileToImprove_pathFinderRegistry = new WeakMap(), _MoveToTileToImprove_strategyNoteRegistry = new WeakMap(), _MoveToTileToImprove_tileImprovementRegistry = new WeakMap();
exports.default = MoveToTileToImprove;
//# sourceMappingURL=MoveToTileToImprove.js.map