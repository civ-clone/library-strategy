import {
  ActiveUnit,
  InactiveUnit,
} from '@civ-clone/library-unit/PlayerActions';
import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  PathFinderRegistry,
  instance as pathFinderRegistryInstance,
} from '@civ-clone/core-world-path/PathFinderRegistry';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  StrategyNoteRegistry,
  instance as strategyNoteRegistryInstance,
} from '@civ-clone/core-strategy/StrategyNoteRegistry';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import {
  UnitImprovementRegistry,
  instance as unitImprovementRegistryInstance,
} from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import BuyDefender from './BuyDefender';
import { ChangeProduction } from '@civ-clone/core-city-build/PlayerActions';
import Defence from '@civ-clone/core-unit/Yields/Defence';
import { Fortifiable } from '@civ-clone/library-unit/Types';
import MoveToDefendCity from './MoveToDefendCity';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import PreProcessTurn from '../PlayerActions/PreProcessTurn';
import Strategy from '@civ-clone/core-strategy/Strategy';
import { scoreCity } from '../lib/cityDetails';
import { unitYieldValue } from '../lib/unitDetails';

export class CheckForUndefendedCities extends Strategy {
  #cityBuildRegistry: CityBuildRegistry;
  #cityGrowthRegistry: CityGrowthRegistry;
  #cityRegistry: CityRegistry;
  #pathFinderRegistry: PathFinderRegistry;
  #playerTreasuryRegistry: PlayerTreasuryRegistry;
  #strategyNoteRegistry: StrategyNoteRegistry;
  #tileImprovementRegistry: TileImprovementRegistry;
  #unitRegistry: UnitRegistry;
  #unitImprovementRegistry: UnitImprovementRegistry;

  constructor(
    cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
    cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
    cityRegistry: CityRegistry = cityRegistryInstance,
    pathFinderRegistry: PathFinderRegistry = pathFinderRegistryInstance,
    playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    strategyNoteRegistry: StrategyNoteRegistry = strategyNoteRegistryInstance,
    tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
    unitImprovementRegistry: UnitImprovementRegistry = unitImprovementRegistryInstance,
    unitRegistry: UnitRegistry = unitRegistryInstance
  ) {
    super(ruleRegistry);

    this.#cityBuildRegistry = cityBuildRegistry;
    this.#cityGrowthRegistry = cityGrowthRegistry;
    this.#cityRegistry = cityRegistry;
    this.#pathFinderRegistry = pathFinderRegistry;
    this.#playerTreasuryRegistry = playerTreasuryRegistry;
    this.#strategyNoteRegistry = strategyNoteRegistry;
    this.#tileImprovementRegistry = tileImprovementRegistry;
    this.#unitImprovementRegistry = unitImprovementRegistry;
    this.#unitRegistry = unitRegistry;
  }

  attempt(action: PlayerAction): boolean {
    if (!(action instanceof PreProcessTurn)) {
      return false;
    }

    // Focus on higher priority `City`s first...
    const undefendedCities = this.#cityRegistry
        .getByPlayer(action.player())
        .sort((cityA, cityB) => scoreCity(cityB) - scoreCity(cityA)),
      unitActions = action
        .player()
        .actions()
        .filter(
          (action): action is InactiveUnit | ActiveUnit =>
            action instanceof InactiveUnit ||
            (action instanceof ActiveUnit &&
              action.value() instanceof Fortifiable &&
              action.value().busy() === null &&
              unitYieldValue(action.value(), Defence, this.ruleRegistry()) > 0)
        );

    undefendedCities.forEach((city) => {
      const cityBuild = this.#cityBuildRegistry.getByCity(city),
        buyDefender = new BuyDefender(this.#playerTreasuryRegistry),
        hasBoughtDefender = buyDefender.attempt(
          new ChangeProduction(city.player(), cityBuild)
        );

      if (hasBoughtDefender) {
        return true;
      }

      unitActions
        .sort(
          (actionA, actionB) =>
            actionB.value().tile().distanceFrom(city.tile()) -
            actionA.value().tile().distanceFrom(city.tile())
        )
        .some((action) =>
          new MoveToDefendCity(
            city,
            undefined,
            this.#pathFinderRegistry,
            this.ruleRegistry(),
            this.#strategyNoteRegistry
          ).attempt(action)
        );
    });

    return true;
  }
}

export default CheckForUndefendedCities;
