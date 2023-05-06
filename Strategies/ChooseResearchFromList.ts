import {
  AdvancedFlight,
  Alphabet,
  Astronomy,
  Automobile,
  Banking,
  BridgeBuilding,
  BronzeWorking,
  CeremonialBurial,
  Chemistry,
  Chivalry,
  CodeOfLaws,
  Communism,
  Computers,
  Conscription,
  Construction,
  Corporation,
  Currency,
  Democracy,
  Electricity,
  Electronics,
  Engineering,
  Flight,
  GeneticEngineering,
  Gunpowder,
  HorsebackRiding,
  Industrialization,
  Invention,
  IronWorking,
  LaborUnion,
  Literacy,
  Magnetism,
  MapMaking,
  Masonry,
  MassProduction,
  Mathematics,
  Medicine,
  Metallurgy,
  Monarchy,
  Mysticism,
  Navigation,
  NuclearPower,
  Philosophy,
  Physics,
  Pottery,
  Railroad,
  Recycling,
  Religion,
  Robotics,
  Rocketry,
  SpaceFlight,
  SteamEngine,
  Steel,
  TheRepublic,
  TheWheel,
  TheoryOfGravity,
  Trade,
  University,
  Writing,
} from '@civ-clone/library-science/Advances';
import {
  Civilized,
  Expansionist,
  Militaristic,
  Perfectionist,
} from '@civ-clone/library-civilization/Traits';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TraitRegistry,
  instance as traitRegistryInstance,
} from '@civ-clone/core-civilization/TraitRegistry';
import Advance from '@civ-clone/core-science/Advance';
import ChooseFromList from '@civ-clone/core-strategy-ai-client/PlayerActions/ChooseFromList';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
import Trait from '@civ-clone/core-civilization/Trait';
import { playerHasTrait } from '@civ-clone/library-civilization/lib/playerHasTrait';

// TODO: These should probably be more generically determined, probably via `Rule`s.
const keyTechnologies = [SpaceFlight, Automobile, Gunpowder, Industrialization];

// TODO: These should probably be more generically determined, probably via `Rule`s.
const priorities = new Map<typeof Trait, (typeof Advance)[]>([
  [
    Civilized,
    [
      Alphabet,
      Astronomy,
      Banking,
      BridgeBuilding,
      CeremonialBurial,
      Chemistry,
      CodeOfLaws,
      Computers,
      Construction,
      Corporation,
      Currency,
      Democracy,
      Electricity,
      Electronics,
      Engineering,
      Industrialization,
      Invention,
      Literacy,
      Masonry,
      Mathematics,
      Medicine,
      Monarchy,
      Mysticism,
      Navigation,
      Philosophy,
      Physics,
      Pottery,
      Railroad,
      Religion,
      SpaceFlight,
      TheRepublic,
      TheoryOfGravity,
      Trade,
      University,
      Writing,
    ],
  ],
  [
    Perfectionist,
    [
      Banking,
      BridgeBuilding,
      CeremonialBurial,
      CodeOfLaws,
      Currency,
      GeneticEngineering,
      Industrialization,
      Masonry,
      Medicine,
      Monarchy,
      NuclearPower,
      Pottery,
      Recycling,
      Religion,
      Robotics,
      TheRepublic,
      Trade,
      University,
      Writing,
    ],
  ],
  [
    Expansionist,
    [
      AdvancedFlight,
      Astronomy,
      Communism,
      Gunpowder,
      HorsebackRiding,
      Industrialization,
      Magnetism,
      MapMaking,
      Medicine,
      Monarchy,
      Mysticism,
      Navigation,
      Railroad,
      Religion,
      SteamEngine,
      TheWheel,
      Trade,
    ],
  ],
  [
    Militaristic,
    [
      AdvancedFlight,
      Automobile,
      BronzeWorking,
      Chivalry,
      Conscription,
      Flight,
      Gunpowder,
      HorsebackRiding,
      IronWorking,
      LaborUnion,
      Magnetism,
      MapMaking,
      MassProduction,
      Mathematics,
      Metallurgy,
      Navigation,
      Robotics,
      Rocketry,
      SteamEngine,
      Steel,
      TheWheel,
    ],
  ],
]);

declare global {
  interface ChoiceMetaDataMap {
    'capture-city.steal-advance': typeof Advance;
    'choose-research': typeof Advance;
    'diplomacy.exchange-knowledge': typeof Advance;
  }
}

export class ChooseResearchFromList extends Strategy {
  #handledKeys: (keyof ChoiceMetaDataMap)[] = [];
  #randomNumberGenerator: () => number;
  #traitRegistry: TraitRegistry;

  constructor(
    handledKeys: (keyof ChoiceMetaDataMap)[] = [
      'capture-city.steal-advance',
      'choose-research',
      'diplomacy.exchange-knowledge',
    ],
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    traitRegistry: TraitRegistry = traitRegistryInstance,
    randomNumberGenerator: () => number = () => Math.random()
  ) {
    super(ruleRegistry);

    this.#handledKeys.push(...handledKeys);
    this.#randomNumberGenerator = randomNumberGenerator;
    this.#traitRegistry = traitRegistry;
  }

  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ChooseFromList)) {
      return false;
    }

    const listData = action.value();

    if (!this.#handledKeys.includes(listData.meta().key())) {
      return false;
    }

    const list = listData
        .meta()
        .choices()
        .map((choice) => choice.value()),
      keyTechs = (list as (typeof Advance)[]).filter(
        (AdvanceType: typeof Advance) => keyTechnologies.includes(AdvanceType)
      );

    if (keyTechs.length) {
      listData.choose(this.pickRandomFromList(keyTechs));

      return true;
    }

    const topPriority = Array.from(priorities.entries())
      .flatMap(([TraitType, advances]) => {
        if (playerHasTrait(action.player(), TraitType, this.#traitRegistry)) {
          return advances;
        }

        return [];
      })
      .filter((AdvanceType) => list.includes(AdvanceType));

    if (topPriority.length) {
      listData.choose(this.pickRandomFromList(topPriority));

      return true;
    }

    listData.choose(this.pickRandomFromList(list));

    return true;
  }

  private pickRandomFromList<T>(list: T[]): T {
    return list[Math.floor(list.length * this.#randomNumberGenerator())];
  }
}

export default ChooseResearchFromList;
