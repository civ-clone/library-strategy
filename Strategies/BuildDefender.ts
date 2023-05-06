import {
  ChangeProduction,
  CityBuild,
} from '@civ-clone/core-city-build/PlayerActions';
import Attack from '@civ-clone/core-unit/Yields/Attack';
import Defence from '@civ-clone/core-unit/Yields/Defence';
import { Fortifiable } from '@civ-clone/library-unit/Types';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
import Unit from '@civ-clone/core-unit/Unit';
import { unitTypeYieldValue } from '../lib/unitDetails';

export class BuildDefender extends Strategy {
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
            // Order by highest `Defence`...
            unitTypeYieldValue(buildItemB.item() as typeof Unit, Defence) -
              unitTypeYieldValue(buildItemA.item() as typeof Unit, Defence) ||
            // ...and lowest `Attack`.
            unitTypeYieldValue(buildItemA.item() as typeof Unit, Attack) -
              unitTypeYieldValue(buildItemB.item() as typeof Unit, Attack)
        );

    cityBuild.build(strongestDefender.item());

    return true;
  }
}

export default BuildDefender;
