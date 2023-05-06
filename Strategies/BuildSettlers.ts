import {
  ChangeProduction,
  CityBuild as CityBuildAction,
} from '@civ-clone/core-city-build/PlayerActions';
import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import Food from '@civ-clone/base-terrain-yield-food/Food';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Production from '@civ-clone/base-terrain-yield-production/Production';
import Settlers from '@civ-clone/base-unit-settlers/Settlers';
import Strategy from '@civ-clone/core-strategy/Strategy';
import { reduceYields } from '@civ-clone/core-yield/lib/reduceYields';

export class BuildSettlers extends Strategy {
  #cityGrowthRegistry: CityGrowthRegistry;
  #unitRegistry: UnitRegistry;

  constructor(
    cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    unitRegistry: UnitRegistry = unitRegistryInstance
  ) {
    super(ruleRegistry);

    this.#cityGrowthRegistry = cityGrowthRegistry;
    this.#unitRegistry = unitRegistry;
  }

  attempt(action: PlayerAction): boolean {
    if (
      !(action instanceof ChangeProduction || action instanceof CityBuildAction)
    ) {
      return false;
    }

    const cityBuild = action.value(),
      [settlersBuildItem] = cityBuild
        .available()
        .filter((cityBuild) => cityBuild.item() === Settlers);

    if (!settlersBuildItem) {
      return false;
    }

    const city = cityBuild.city(),
      [spareFood, spareProduction] = reduceYields(
        city.yields(),
        Food,
        Production
      );

    // TODO: This should come from a `Rule` somehow
    if (spareFood < 2) {
      return false;
    }

    const cityGrowth = this.#cityGrowthRegistry.getByCity(city),
      turnsToGrow = Math.ceil(cityGrowth.cost().value() / spareFood),
      turnsToProduce = Math.ceil(
        settlersBuildItem.cost().value() / spareProduction
      );

    // Allow building `Settlers` if we'll grow before we produce the item
    if (cityGrowth.size() < 2 && turnsToProduce <= turnsToGrow) {
      return false;
    }

    cityBuild.build(Settlers);

    return true;
  }
}

export default BuildSettlers;
