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
var _ImproveTile_cityRegistry, _ImproveTile_tileImprovementRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImproveTile = void 0;
const PlayerActions_1 = require("@civ-clone/library-unit/PlayerActions");
const Actions_1 = require("@civ-clone/library-unit/Actions");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const tileDetails_1 = require("../lib/tileDetails");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
const Types_1 = require("@civ-clone/library-unit/Types");
const unitDetails_1 = require("../lib/unitDetails");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
class ImproveTile extends Strategy_1.default {
    constructor(cityRegistry = CityRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) {
        super(ruleRegistry);
        _ImproveTile_cityRegistry.set(this, void 0);
        _ImproveTile_tileImprovementRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _ImproveTile_cityRegistry, cityRegistry, "f");
        __classPrivateFieldSet(this, _ImproveTile_tileImprovementRegistry, tileImprovementRegistry, "f");
    }
    attempt(action) {
        if (!(action instanceof PlayerActions_1.ActiveUnit || action instanceof PlayerActions_1.InactiveUnit)) {
            return false;
        }
        const unit = action.value();
        if (!(unit instanceof Types_1.Worker)) {
            return false;
        }
        if (!((0, tileDetails_1.shouldIrrigate)(unit.tile(), unit.player(), __classPrivateFieldGet(this, _ImproveTile_cityRegistry, "f"), __classPrivateFieldGet(this, _ImproveTile_tileImprovementRegistry, "f")) ||
            (0, tileDetails_1.shouldMine)(unit.tile(), unit.player(), __classPrivateFieldGet(this, _ImproveTile_cityRegistry, "f"), __classPrivateFieldGet(this, _ImproveTile_tileImprovementRegistry, "f")) ||
            (0, tileDetails_1.shouldRoad)(unit.tile(), unit.player(), __classPrivateFieldGet(this, _ImproveTile_cityRegistry, "f"), __classPrivateFieldGet(this, _ImproveTile_tileImprovementRegistry, "f")) ||
            (0, tileDetails_1.shouldRailroad)(unit.tile(), unit.player(), __classPrivateFieldGet(this, _ImproveTile_cityRegistry, "f"), __classPrivateFieldGet(this, _ImproveTile_tileImprovementRegistry, "f"))) ||
            !((0, unitDetails_1.unitCanActionAtTile)(unit, Actions_1.BuildIrrigation) ||
                (0, unitDetails_1.unitCanActionAtTile)(unit, Actions_1.BuildMine) ||
                (0, unitDetails_1.unitCanActionAtTile)(unit, Actions_1.BuildRoad) ||
                (0, unitDetails_1.unitCanActionAtTile)(unit, Actions_1.BuildRailroad))) {
            return false;
        }
        return [Actions_1.BuildIrrigation, Actions_1.BuildMine, Actions_1.BuildRoad, Actions_1.BuildRailroad].some((ActionType) => {
            const [action] = unit
                .actions()
                .filter((action) => action instanceof ActionType);
            if (!action) {
                return false;
            }
            action.perform();
            return true;
        });
    }
}
exports.ImproveTile = ImproveTile;
_ImproveTile_cityRegistry = new WeakMap(), _ImproveTile_tileImprovementRegistry = new WeakMap();
exports.default = ImproveTile;
//# sourceMappingURL=ImproveTile.js.map