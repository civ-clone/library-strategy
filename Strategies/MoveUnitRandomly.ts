import {
  ActiveUnit,
  InactiveUnit,
} from '@civ-clone/library-unit/PlayerActions';
import { Move } from '@civ-clone/library-unit/Actions';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';

export class MoveUnitRandomly extends Strategy {
  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ActiveUnit || action instanceof InactiveUnit)) {
      return false;
    }

    const unit = action.value(),
      [unitAction] = unit
        .tile()
        .getNeighbours()
        .flatMap((tile) =>
          unit.actions(tile).filter((action) => action.sourceClass() === Move)
        )
        .sort(() => Math.floor(Math.random() * 3) - 1);

    if (!unitAction) {
      return false;
    }

    unit.action(unitAction);

    return true;
  }
}

export default MoveUnitRandomly;
