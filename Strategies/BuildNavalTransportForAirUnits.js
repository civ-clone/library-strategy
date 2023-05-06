"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildNavalTransportForAirUnits = void 0;
const PlayerActions_1 = require("@civ-clone/core-city-build/PlayerActions");
const Units_1 = require("@civ-clone/library-unit/Units");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
class BuildNavalTransportForAirUnits extends Strategy_1.default {
    attempt(action) {
        if (!(action instanceof PlayerActions_1.ChangeProduction || action instanceof PlayerActions_1.CityBuild)) {
            return false;
        }
        const cityBuild = action.value(), [transport] = cityBuild
            .available()
            .filter((buildItem) => [Units_1.Carrier].includes(buildItem.item()));
        cityBuild.build(transport.item());
        return true;
    }
}
exports.BuildNavalTransportForAirUnits = BuildNavalTransportForAirUnits;
exports.default = BuildNavalTransportForAirUnits;
//# sourceMappingURL=BuildNavalTransportForAirUnits.js.map