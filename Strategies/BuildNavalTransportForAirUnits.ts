import {
  ChangeProduction,
  CityBuild,
} from '@civ-clone/core-city-build/PlayerActions';
import { Carrier } from '@civ-clone/library-unit/Units';
import { IBuildable } from '@civ-clone/core-city-build/Buildable';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';

export class BuildNavalTransportForAirUnits extends Strategy {
  attempt(action: PlayerAction): boolean {
    if (!(action instanceof ChangeProduction || action instanceof CityBuild)) {
      return false;
    }

    const cityBuild = action.value(),
      [transport] = cityBuild
        .available()
        .filter((buildItem) =>
          ([Carrier] as IBuildable[]).includes(buildItem.item())
        );

    cityBuild.build(transport.item());

    return true;
  }
}

export default BuildNavalTransportForAirUnits;
