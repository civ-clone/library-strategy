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
var _BuildExplorer_UnitType;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildExplorer = void 0;
const PlayerActions_1 = require("@civ-clone/core-city-build/PlayerActions");
const Yields_1 = require("@civ-clone/core-unit/Yields");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Types_1 = require("@civ-clone/library-unit/Types");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
const unitDetails_1 = require("../lib/unitDetails");
class BuildExplorer extends Strategy_1.default {
    constructor(UnitType = Types_1.Land, ruleRegistry = RuleRegistry_1.instance) {
        super(ruleRegistry);
        _BuildExplorer_UnitType.set(this, void 0);
        __classPrivateFieldSet(this, _BuildExplorer_UnitType, UnitType, "f");
    }
    attempt(action) {
        if (!(action instanceof PlayerActions_1.ChangeProduction || action instanceof PlayerActions_1.CityBuild)) {
            return false;
        }
        const cityBuild = action.value(), [strongestDefender] = cityBuild
            .available()
            .filter((buildItem) => Object.prototype.isPrototypeOf.call(__classPrivateFieldGet(this, _BuildExplorer_UnitType, "f"), buildItem.item()))
            .sort((buildItemA, buildItemB) => 
        // Order by highest `Movement`...
        (0, unitDetails_1.unitTypeYieldValue)(buildItemB.item(), Yields_1.Movement) -
            (0, unitDetails_1.unitTypeYieldValue)(buildItemA.item(), Yields_1.Movement) ||
            // ...and highest `Defence`.
            (0, unitDetails_1.unitTypeYieldValue)(buildItemB.item(), Yields_1.Defence) -
                (0, unitDetails_1.unitTypeYieldValue)(buildItemA.item(), Yields_1.Defence));
        cityBuild.build(strongestDefender.item());
        return true;
    }
}
exports.BuildExplorer = BuildExplorer;
_BuildExplorer_UnitType = new WeakMap();
exports.default = BuildExplorer;
//# sourceMappingURL=BuildExplorer.js.map