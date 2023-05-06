import {
  PathFinderRegistry,
  instance as pathFinderRegistryInstance,
} from '@civ-clone/core-world-path/PathFinderRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  StrategyNoteRegistry,
  instance as strategyNoteRegistryInstance,
} from '@civ-clone/core-strategy/StrategyNoteRegistry';
import ActiveUnit from '@civ-clone/base-player-action-active-unit/ActiveUnit';
import Path from '@civ-clone/core-world-path/Path';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
import Strategy from '@civ-clone/core-strategy/Strategy';
import { generateKey } from '@civ-clone/base-unit-action-goto/GoTo';
import moveAlongPath from '@civ-clone/base-unit-action-goto/lib/moveAlongPath';

export class ContinueOnPath extends Strategy {
  #pathFinderRegistry: PathFinderRegistry;
  #strategyNoteRegistry: StrategyNoteRegistry;

  constructor(
    pathFinderRegistry: PathFinderRegistry = pathFinderRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    strategyNoteRegistry: StrategyNoteRegistry = strategyNoteRegistryInstance
  ) {
    super(ruleRegistry);

    this.#pathFinderRegistry = pathFinderRegistry;
    this.#strategyNoteRegistry = strategyNoteRegistry;
  }
  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ActiveUnit)) {
      return false;
    }

    const unit = action.value(),
      existingTargetNote = this.#strategyNoteRegistry.getByKey<Path>(
        generateKey(unit)
      );

    if (!existingTargetNote) {
      return false;
    }

    const path = existingTargetNote.value();

    moveAlongPath(unit, path);

    return true;
  }

  /**
   * Fixed, really high, `Priority` to handle this scenario before anything else
   */
  priority(action: PlayerAction): Priority {
    return new Priority(0);
  }
}

export default ContinueOnPath;
