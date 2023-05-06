import {
  ActiveUnit,
  InactiveUnit,
} from '@civ-clone/library-unit/PlayerActions';
import { NoOrders } from '@civ-clone/library-unit/Actions';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';

export class DoNothingWithUnit extends Strategy {
  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ActiveUnit || action instanceof InactiveUnit)) {
      return false;
    }

    console.log('DoNothingWithUnit');

    const unit = action.value();

    unit.action(
      new NoOrders(unit.tile(), unit.tile(), unit, this.ruleRegistry())
    );

    return true;
  }
}

export default DoNothingWithUnit;
