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
var _MoveToGoodSiteForCity_cityRegistry, _MoveToGoodSiteForCity_pathFinderRegistry, _MoveToGoodSiteForCity_strategyNoteRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveToGoodSiteForCity = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const PathFinderRegistry_1 = require("@civ-clone/core-world-path/PathFinderRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const StrategyNoteRegistry_1 = require("@civ-clone/core-strategy/StrategyNoteRegistry");
const goodSiteForCity_1 = require("../lib/goodSiteForCity");
const ActiveUnit_1 = require("@civ-clone/base-player-action-active-unit/ActiveUnit");
const GoTo_1 = require("@civ-clone/base-unit-action-goto/GoTo");
const Settlers_1 = require("@civ-clone/base-unit-settlers/Settlers");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
const MAX_TRAVEL_DISTANCE = 15;
class MoveToGoodSiteForCity extends Strategy_1.default {
    constructor(cityRegistry = CityRegistry_1.instance, pathFinderRegistry = PathFinderRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, strategyNoteRegistry = StrategyNoteRegistry_1.instance) {
        super(ruleRegistry);
        _MoveToGoodSiteForCity_cityRegistry.set(this, void 0);
        _MoveToGoodSiteForCity_pathFinderRegistry.set(this, void 0);
        _MoveToGoodSiteForCity_strategyNoteRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _MoveToGoodSiteForCity_cityRegistry, cityRegistry, "f");
        __classPrivateFieldSet(this, _MoveToGoodSiteForCity_pathFinderRegistry, pathFinderRegistry, "f");
        __classPrivateFieldSet(this, _MoveToGoodSiteForCity_strategyNoteRegistry, strategyNoteRegistry, "f");
    }
    attempt(action) {
        if (!(action instanceof ActiveUnit_1.default)) {
            return false;
        }
        const unit = action.value();
        if (!(unit instanceof Settlers_1.default)) {
            return false;
        }
        const note = __classPrivateFieldGet(this, _MoveToGoodSiteForCity_strategyNoteRegistry, "f").getByKey((0, goodSiteForCity_1.generateKey)(unit.player()));
        if (!note) {
            return false;
        }
        const [target] = note
            .value()
            .map((tile) => [tile, tile.distanceFrom(unit.tile())])
            // TODO: check MAX_TRAVEL_DISTANCE is sufficient
            // TODO: check can pathTo target
            .filter(([, distance]) => distance < MAX_TRAVEL_DISTANCE &&
            (0, goodSiteForCity_1.goodSiteForCity)(unit.player(), unit.tile(), undefined, undefined, __classPrivateFieldGet(this, _MoveToGoodSiteForCity_cityRegistry, "f")))
            .sort(([, distanceA], [, distanceB]) => distanceA - distanceB)
            .map(([tile]) => tile);
        if (!target) {
            return false;
        }
        const goTo = new GoTo_1.default(unit.tile(), target, unit, this.ruleRegistry(), __classPrivateFieldGet(this, _MoveToGoodSiteForCity_pathFinderRegistry, "f"), __classPrivateFieldGet(this, _MoveToGoodSiteForCity_strategyNoteRegistry, "f"));
        goTo.perform();
        return true;
    }
}
exports.MoveToGoodSiteForCity = MoveToGoodSiteForCity;
_MoveToGoodSiteForCity_cityRegistry = new WeakMap(), _MoveToGoodSiteForCity_pathFinderRegistry = new WeakMap(), _MoveToGoodSiteForCity_strategyNoteRegistry = new WeakMap();
exports.default = MoveToGoodSiteForCity;
//# sourceMappingURL=MoveToGoodSiteForCity.js.map