"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canCompleteProduction = exports.isCityDefended = exports.scoreCity = void 0;
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const BuildCost_1 = require("@civ-clone/core-city-build/Rules/BuildCost");
const BuildItem_1 = require("@civ-clone/core-city-build/BuildItem");
const Gold_1 = require("@civ-clone/base-city-yield-gold/Gold");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const Spend_1 = require("@civ-clone/core-treasury/Rules/Spend");
const buildCostCache = new Map();
const scoreCity = (city, cityGrowthRegistry = CityGrowthRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) => city.yields().reduce((total, cityYield) => total + cityYield.value(), 0) +
    cityGrowthRegistry.getByCity(city).size() * 10 +
    unitRegistry.getByCity(city).length * 2 +
    cityImprovementRegistry.getByCity(city).reduce((total, cityImprovement) => {
        if (!buildCostCache.has(cityImprovement.sourceClass())) {
            const buildItem = new BuildItem_1.default(cityImprovement.sourceClass(), city, ruleRegistry), [buildCost] = ruleRegistry.process(BuildCost_1.default, buildItem, city);
            buildCostCache.set(cityImprovement.sourceClass(), buildCost.value() / 10);
        }
        return total + buildCostCache.get(cityImprovement.sourceClass());
    }, 0);
exports.scoreCity = scoreCity;
const isCityDefended = (defendingUnits, citySize) => defendingUnits >= Math.ceil(citySize / 5);
exports.isCityDefended = isCityDefended;
const canCompleteProduction = (city, YieldType = Gold_1.default, cityBuildRegistry = CityBuildRegistry_1.instance, playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => {
    const cityBuild = cityBuildRegistry.getByCity(city), [spendCost] = ruleRegistry
        .process(Spend_1.default, cityBuild)
        .filter((spendCost) => spendCost.resource() === YieldType), playerTreasury = playerTreasuryRegistry.getByPlayerAndType(city.player(), YieldType);
    if (!spendCost || !playerTreasury) {
        return false;
    }
    return spendCost.value() <= playerTreasury.value();
};
exports.canCompleteProduction = canCompleteProduction;
//# sourceMappingURL=cityDetails.js.map