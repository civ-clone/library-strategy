import { Attack, Defence, Movement } from '@civ-clone/core-unit/Yields';
import {
  ChangeProduction,
  CityBuild,
} from '@civ-clone/core-city-build/PlayerActions';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import { Fortifiable } from '@civ-clone/library-unit/Types';
import { Gold } from '@civ-clone/library-city/Yields';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
import Unit from '@civ-clone/core-unit/Unit';
import { unitTypeYieldValue } from '../lib/unitDetails';

export class BuyDefender extends Strategy {
  #playerTreasuryRegistry: PlayerTreasuryRegistry;

  constructor(
    playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super(ruleRegistry);

    this.#playerTreasuryRegistry = playerTreasuryRegistry;
  }

  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ChangeProduction || action instanceof CityBuild)) {
      return false;
    }

    const cityBuild = action.value(),
      [strongestDefender] = cityBuild
        .available()
        .filter((buildItem) =>
          Object.prototype.isPrototypeOf.call(Fortifiable, buildItem.item())
        )
        .sort(
          (buildItemA, buildItemB) =>
            // Order by strongest `Defence`...
            unitTypeYieldValue(buildItemB.item() as typeof Unit, Defence) -
              unitTypeYieldValue(buildItemA.item() as typeof Unit, Defence) ||
            // ...then by `Attack`...
            unitTypeYieldValue(buildItemB.item() as typeof Unit, Attack) -
              unitTypeYieldValue(buildItemA.item() as typeof Unit, Attack) ||
            // ...and finally `Movement`.
            unitTypeYieldValue(buildItemB.item() as typeof Unit, Movement) -
              unitTypeYieldValue(buildItemA.item() as typeof Unit, Movement)
        );

    cityBuild.build(strongestDefender.item());

    if (cityBuild.progress().value() >= cityBuild.cost().value()) {
      return true;
    }

    const playerTreasury = this.#playerTreasuryRegistry.getByPlayerAndType(
        cityBuild.city().player(),
        Gold
      ),
      [spendCost] = playerTreasury
        .cost(cityBuild.city())
        .filter((spendCost) => spendCost.resource() === Gold);

    if (!spendCost || spendCost.value() > playerTreasury.value()) {
      return false;
    }

    playerTreasury.buy(cityBuild.city());

    return true;
  }
}

export default BuyDefender;
