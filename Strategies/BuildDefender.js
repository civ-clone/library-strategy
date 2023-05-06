"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildDefender = void 0;
const PlayerActions_1 = require("@civ-clone/core-city-build/PlayerActions");
const Attack_1 = require("@civ-clone/core-unit/Yields/Attack");
const Defence_1 = require("@civ-clone/core-unit/Yields/Defence");
const Types_1 = require("@civ-clone/library-unit/Types");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
const unitDetails_1 = require("../lib/unitDetails");
class BuildDefender extends Strategy_1.default {
    attempt(action) {
        if (!(action instanceof PlayerActions_1.ChangeProduction || action instanceof PlayerActions_1.CityBuild)) {
            return false;
        }
        const cityBuild = action.value(), [strongestDefender] = cityBuild
            .available()
            .filter((buildItem) => Object.prototype.isPrototypeOf.call(Types_1.Fortifiable, buildItem.item()))
            .sort((buildItemA, buildItemB) => 
        // Order by highest `Defence`...
        (0, unitDetails_1.unitTypeYieldValue)(buildItemB.item(), Defence_1.default) -
            (0, unitDetails_1.unitTypeYieldValue)(buildItemA.item(), Defence_1.default) ||
            // ...and lowest `Attack`.
            (0, unitDetails_1.unitTypeYieldValue)(buildItemA.item(), Attack_1.default) -
                (0, unitDetails_1.unitTypeYieldValue)(buildItemB.item(), Attack_1.default));
        cityBuild.build(strongestDefender.item());
        return true;
    }
}
exports.BuildDefender = BuildDefender;
exports.default = BuildDefender;
//# sourceMappingURL=BuildDefender.js.map