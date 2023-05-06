import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  StrategyRegistry,
  instance as strategyRegistryInstance,
} from '@civ-clone/core-strategy/StrategyRegistry';
import {
  TraitRegistry,
  instance as traitRegistryInstance,
} from '@civ-clone/core-civilization/TraitRegistry';
import ChoiceMeta from '@civ-clone/core-client/ChoiceMeta';
import ChooseFromList from '@civ-clone/core-strategy-ai-client/PlayerActions/ChooseFromList';
import ChooseResearchAction from '@civ-clone/library-science/PlayerActions/ChooseResearch';
import Data from '@civ-clone/core-strategy-ai-client/PlayerActions/ChooseFromList/Data';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';

export class ChooseResearch extends Strategy {
  #strategyRegistry: StrategyRegistry;
  #traitRegistry: TraitRegistry;
  #randomNumberGenerator: () => number;

  constructor(
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    strategyRegistry: StrategyRegistry = strategyRegistryInstance,
    traitRegistry: TraitRegistry = traitRegistryInstance,
    randomNumberGenerator: () => number = () => Math.random()
  ) {
    super(ruleRegistry);

    this.#strategyRegistry = strategyRegistry;
    this.#traitRegistry = traitRegistry;
    this.#randomNumberGenerator = randomNumberGenerator;
  }

  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ChooseResearchAction)) {
      return false;
    }

    const playerResearch = action.value(),
      chooseResearchData = new Data(
        new ChoiceMeta(playerResearch.available(), 'choose-research')
      );

    this.#strategyRegistry.attempt(
      new ChooseFromList(action.player(), chooseResearchData)
    );

    if (!chooseResearchData.value()) {
      throw new Error(`Unhandled: ${this.constructor.name}`);
    }

    playerResearch.research(chooseResearchData.value());

    return true;
  }
}

export default ChooseResearch;
