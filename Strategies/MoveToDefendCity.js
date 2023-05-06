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
var _MoveToDefendCity_city, _MoveToDefendCity_maxTravelDistance, _MoveToDefendCity_pathFinderRegistry, _MoveToDefendCity_strategyNoteRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveToDefendCity = void 0;
const PlayerActions_1 = require("@civ-clone/library-unit/PlayerActions");
const PathFinderRegistry_1 = require("@civ-clone/core-world-path/PathFinderRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const StrategyNoteRegistry_1 = require("@civ-clone/core-strategy/StrategyNoteRegistry");
const unitDetails_1 = require("../lib/unitDetails");
const Yields_1 = require("@civ-clone/core-unit/Yields");
const Actions_1 = require("@civ-clone/library-unit/Actions");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
class MoveToDefendCity extends Strategy_1.default {
    constructor(city, maxTravelDistance = 15, pathFinderRegistry = PathFinderRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, strategyNoteRegistry = StrategyNoteRegistry_1.instance) {
        super(ruleRegistry);
        _MoveToDefendCity_city.set(this, void 0);
        _MoveToDefendCity_maxTravelDistance.set(this, void 0);
        _MoveToDefendCity_pathFinderRegistry.set(this, void 0);
        _MoveToDefendCity_strategyNoteRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _MoveToDefendCity_city, city, "f");
        __classPrivateFieldSet(this, _MoveToDefendCity_maxTravelDistance, maxTravelDistance, "f");
        __classPrivateFieldSet(this, _MoveToDefendCity_pathFinderRegistry, pathFinderRegistry, "f");
        __classPrivateFieldSet(this, _MoveToDefendCity_strategyNoteRegistry, strategyNoteRegistry, "f");
    }
    attempt(action) {
        if (!(action instanceof PlayerActions_1.ActiveUnit || action instanceof PlayerActions_1.InactiveUnit)) {
            return false;
        }
        const unit = action.value();
        if (!(0, unitDetails_1.unitYieldValue)(unit, Yields_1.Defence, this.ruleRegistry()) ||
            !(0, unitDetails_1.canPathTo)(unit, __classPrivateFieldGet(this, _MoveToDefendCity_city, "f").tile(), __classPrivateFieldGet(this, _MoveToDefendCity_pathFinderRegistry, "f")) ||
            unit.tile().distanceFrom(__classPrivateFieldGet(this, _MoveToDefendCity_city, "f").tile()) > __classPrivateFieldGet(this, _MoveToDefendCity_maxTravelDistance, "f")) {
            return false;
        }
        const goTo = new Actions_1.GoTo(unit.tile(), __classPrivateFieldGet(this, _MoveToDefendCity_city, "f").tile(), unit, this.ruleRegistry(), __classPrivateFieldGet(this, _MoveToDefendCity_pathFinderRegistry, "f"), __classPrivateFieldGet(this, _MoveToDefendCity_strategyNoteRegistry, "f"));
        goTo.perform();
        return true;
    }
}
exports.MoveToDefendCity = MoveToDefendCity;
_MoveToDefendCity_city = new WeakMap(), _MoveToDefendCity_maxTravelDistance = new WeakMap(), _MoveToDefendCity_pathFinderRegistry = new WeakMap(), _MoveToDefendCity_strategyNoteRegistry = new WeakMap();
exports.default = MoveToDefendCity;
//# sourceMappingURL=MoveToDefendCity.js.map