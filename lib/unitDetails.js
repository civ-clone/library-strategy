"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.existingStrategy = exports.canPathTo = exports.isCityDefender = exports.unitCanActionAtTile = exports.unitTypeYieldValue = exports.unitYieldValue = exports.scoreUnit = exports.isUnitFortified = void 0;
const Yields_1 = require("@civ-clone/core-unit/Yields");
const Yield_1 = require("@civ-clone/core-unit/Rules/Yield");
const PathFinderRegistry_1 = require("@civ-clone/core-world-path/PathFinderRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const StrategyNoteRegistry_1 = require("@civ-clone/core-strategy/StrategyNoteRegistry");
const UnitImprovementRegistry_1 = require("@civ-clone/core-unit-improvement/UnitImprovementRegistry");
const UnitImprovements_1 = require("@civ-clone/library-unit/UnitImprovements");
const StrategyNote_1 = require("@civ-clone/core-strategy/StrategyNote");
const unitTypeYieldCache = new Map();
const isUnitFortified = (unit, unitImprovementRegistry = UnitImprovementRegistry_1.instance) => unitImprovementRegistry
    .getByUnit(unit)
    .some((improvement) => improvement instanceof UnitImprovements_1.Fortified);
exports.isUnitFortified = isUnitFortified;
const scoreUnit = (unit, YieldTypes = [Yields_1.Attack, Yields_1.Defence, Yields_1.Movement, Yields_1.Visibility], ruleRegistry = RuleRegistry_1.instance) => YieldTypes.reduce((total, YieldType) => total + (0, exports.unitYieldValue)(unit, YieldType, ruleRegistry), 0);
exports.scoreUnit = scoreUnit;
const unitYieldValue = (unit, YieldType, ruleRegistry = RuleRegistry_1.instance) => {
    const unitYield = new YieldType();
    ruleRegistry.process(Yield_1.Yield, unit, unitYield);
    return unitYield.value();
};
exports.unitYieldValue = unitYieldValue;
const unitTypeYieldValue = (UnitType, YieldType, ruleRegistry = RuleRegistry_1.instance) => {
    const key = [UnitType.name, YieldType.name].join('-');
    if (!unitTypeYieldCache.has(key)) {
        const unitYield = new YieldType();
        ruleRegistry.process(Yield_1.BaseYield, UnitType, unitYield);
        unitTypeYieldCache.set(key, unitYield.value());
    }
    return unitTypeYieldCache.get(key);
};
exports.unitTypeYieldValue = unitTypeYieldValue;
const unitCanActionAtTile = (unit, ActionType, to = unit.tile(), from = unit.tile()) => unit.actions(to, from).some((action) => action instanceof ActionType);
exports.unitCanActionAtTile = unitCanActionAtTile;
const isCityDefender = (unit, ruleRegistry = RuleRegistry_1.instance, unitImprovementRegistry = UnitImprovementRegistry_1.instance) => (0, exports.unitYieldValue)(unit, Yields_1.Defence, ruleRegistry) > 0 &&
    (0, exports.isUnitFortified)(unit, unitImprovementRegistry);
exports.isCityDefender = isCityDefender;
const canPathTo = (unit, target, pathFinderRegistry = PathFinderRegistry_1.instance) => {
    const [PathFinder] = pathFinderRegistry.entries();
    if (!PathFinder) {
        console.warn('No PathFinder available.');
        return false;
    }
    const pathFinder = new PathFinder(unit, unit.tile(), target), path = pathFinder.generate();
    return !!path;
};
exports.canPathTo = canPathTo;
const existingStrategy = (unit, strategyNoteRegistry = StrategyNoteRegistry_1.instance) => strategyNoteRegistry.getByKey((0, StrategyNote_1.generateKey)(unit, 'strategy'));
exports.existingStrategy = existingStrategy;
//# sourceMappingURL=unitDetails.js.map