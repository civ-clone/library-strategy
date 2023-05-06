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
var _CheckForUndefendedCities_cityBuildRegistry, _CheckForUndefendedCities_cityGrowthRegistry, _CheckForUndefendedCities_cityRegistry, _CheckForUndefendedCities_pathFinderRegistry, _CheckForUndefendedCities_playerTreasuryRegistry, _CheckForUndefendedCities_strategyNoteRegistry, _CheckForUndefendedCities_tileImprovementRegistry, _CheckForUndefendedCities_unitRegistry, _CheckForUndefendedCities_unitImprovementRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckForUndefendedCities = void 0;
const PlayerActions_1 = require("@civ-clone/library-unit/PlayerActions");
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const PathFinderRegistry_1 = require("@civ-clone/core-world-path/PathFinderRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const StrategyNoteRegistry_1 = require("@civ-clone/core-strategy/StrategyNoteRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const UnitImprovementRegistry_1 = require("@civ-clone/core-unit-improvement/UnitImprovementRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const BuyDefender_1 = require("./BuyDefender");
const PlayerActions_2 = require("@civ-clone/core-city-build/PlayerActions");
const Defence_1 = require("@civ-clone/core-unit/Yields/Defence");
const Types_1 = require("@civ-clone/library-unit/Types");
const MoveToDefendCity_1 = require("./MoveToDefendCity");
const PreProcessTurn_1 = require("../PlayerActions/PreProcessTurn");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
const cityDetails_1 = require("../lib/cityDetails");
const unitDetails_1 = require("../lib/unitDetails");
class CheckForUndefendedCities extends Strategy_1.default {
    constructor(cityBuildRegistry = CityBuildRegistry_1.instance, cityGrowthRegistry = CityGrowthRegistry_1.instance, cityRegistry = CityRegistry_1.instance, pathFinderRegistry = PathFinderRegistry_1.instance, playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, strategyNoteRegistry = StrategyNoteRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance, unitImprovementRegistry = UnitImprovementRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) {
        super(ruleRegistry);
        _CheckForUndefendedCities_cityBuildRegistry.set(this, void 0);
        _CheckForUndefendedCities_cityGrowthRegistry.set(this, void 0);
        _CheckForUndefendedCities_cityRegistry.set(this, void 0);
        _CheckForUndefendedCities_pathFinderRegistry.set(this, void 0);
        _CheckForUndefendedCities_playerTreasuryRegistry.set(this, void 0);
        _CheckForUndefendedCities_strategyNoteRegistry.set(this, void 0);
        _CheckForUndefendedCities_tileImprovementRegistry.set(this, void 0);
        _CheckForUndefendedCities_unitRegistry.set(this, void 0);
        _CheckForUndefendedCities_unitImprovementRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _CheckForUndefendedCities_cityBuildRegistry, cityBuildRegistry, "f");
        __classPrivateFieldSet(this, _CheckForUndefendedCities_cityGrowthRegistry, cityGrowthRegistry, "f");
        __classPrivateFieldSet(this, _CheckForUndefendedCities_cityRegistry, cityRegistry, "f");
        __classPrivateFieldSet(this, _CheckForUndefendedCities_pathFinderRegistry, pathFinderRegistry, "f");
        __classPrivateFieldSet(this, _CheckForUndefendedCities_playerTreasuryRegistry, playerTreasuryRegistry, "f");
        __classPrivateFieldSet(this, _CheckForUndefendedCities_strategyNoteRegistry, strategyNoteRegistry, "f");
        __classPrivateFieldSet(this, _CheckForUndefendedCities_tileImprovementRegistry, tileImprovementRegistry, "f");
        __classPrivateFieldSet(this, _CheckForUndefendedCities_unitImprovementRegistry, unitImprovementRegistry, "f");
        __classPrivateFieldSet(this, _CheckForUndefendedCities_unitRegistry, unitRegistry, "f");
    }
    attempt(action) {
        if (!(action instanceof PreProcessTurn_1.default)) {
            return false;
        }
        // Focus on higher priority `City`s first...
        const undefendedCities = __classPrivateFieldGet(this, _CheckForUndefendedCities_cityRegistry, "f")
            .getByPlayer(action.player())
            .sort((cityA, cityB) => (0, cityDetails_1.scoreCity)(cityB) - (0, cityDetails_1.scoreCity)(cityA)), unitActions = action
            .player()
            .actions()
            .filter((action) => action instanceof PlayerActions_1.InactiveUnit ||
            (action instanceof PlayerActions_1.ActiveUnit &&
                action.value() instanceof Types_1.Fortifiable &&
                action.value().busy() === null &&
                (0, unitDetails_1.unitYieldValue)(action.value(), Defence_1.default, this.ruleRegistry()) > 0));
        undefendedCities.forEach((city) => {
            const cityBuild = __classPrivateFieldGet(this, _CheckForUndefendedCities_cityBuildRegistry, "f").getByCity(city), buyDefender = new BuyDefender_1.default(__classPrivateFieldGet(this, _CheckForUndefendedCities_playerTreasuryRegistry, "f")), hasBoughtDefender = buyDefender.attempt(new PlayerActions_2.ChangeProduction(city.player(), cityBuild));
            if (hasBoughtDefender) {
                return true;
            }
            unitActions
                .sort((actionA, actionB) => actionB.value().tile().distanceFrom(city.tile()) -
                actionA.value().tile().distanceFrom(city.tile()))
                .some((action) => new MoveToDefendCity_1.default(city, undefined, __classPrivateFieldGet(this, _CheckForUndefendedCities_pathFinderRegistry, "f"), this.ruleRegistry(), __classPrivateFieldGet(this, _CheckForUndefendedCities_strategyNoteRegistry, "f")).attempt(action));
        });
        return true;
    }
}
exports.CheckForUndefendedCities = CheckForUndefendedCities;
_CheckForUndefendedCities_cityBuildRegistry = new WeakMap(), _CheckForUndefendedCities_cityGrowthRegistry = new WeakMap(), _CheckForUndefendedCities_cityRegistry = new WeakMap(), _CheckForUndefendedCities_pathFinderRegistry = new WeakMap(), _CheckForUndefendedCities_playerTreasuryRegistry = new WeakMap(), _CheckForUndefendedCities_strategyNoteRegistry = new WeakMap(), _CheckForUndefendedCities_tileImprovementRegistry = new WeakMap(), _CheckForUndefendedCities_unitRegistry = new WeakMap(), _CheckForUndefendedCities_unitImprovementRegistry = new WeakMap();
exports.default = CheckForUndefendedCities;
//# sourceMappingURL=CheckForUndefendedCities.js.map