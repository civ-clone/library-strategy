import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import BuildCost from '@civ-clone/core-city-build/Rules/BuildCost';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import YieldValue from '@civ-clone/core-yield/Yield';
import Gold from '@civ-clone/base-city-yield-gold/Gold';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import Spend from '@civ-clone/core-treasury/Rules/Spend';

const buildCostCache = new Map<typeof CityImprovement, number>();

export const scoreCity = (
  city: City,
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance
) =>
  city.yields().reduce((total, cityYield) => total + cityYield.value(), 0) +
  cityGrowthRegistry.getByCity(city).size() * 10 +
  unitRegistry.getByCity(city).length * 2 +
  cityImprovementRegistry.getByCity(city).reduce((total, cityImprovement) => {
    if (!buildCostCache.has(cityImprovement.sourceClass())) {
      const buildItem = new BuildItem(
          cityImprovement.sourceClass(),
          city,
          ruleRegistry
        ),
        [buildCost] = ruleRegistry.process(BuildCost, buildItem, city);

      buildCostCache.set(cityImprovement.sourceClass(), buildCost.value() / 10);
    }

    return total + buildCostCache.get(cityImprovement.sourceClass())!;
  }, 0);

export const isCityDefended = (
  defendingUnits: number,
  citySize: number
): boolean => defendingUnits >= Math.ceil(citySize / 5);

export const canCompleteProduction = (
  city: City,
  YieldType: typeof YieldValue = Gold,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): boolean => {
  const cityBuild = cityBuildRegistry.getByCity(city),
    [spendCost] = ruleRegistry
      .process(Spend, cityBuild)
      .filter((spendCost) => spendCost.resource() === YieldType),
    playerTreasury = playerTreasuryRegistry.getByPlayerAndType(
      city.player(),
      YieldType
    );

  if (!spendCost || !playerTreasury) {
    return false;
  }

  return spendCost.value() <= playerTreasury.value();
};
