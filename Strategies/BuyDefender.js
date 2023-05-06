"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BuyDefender_playerTreasuryRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyDefender = void 0;
const Yields_1 = require("@civ-clone/core-unit/Yields");
const PlayerActions_1 = require("@civ-clone/core-city-build/PlayerActions");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Types_1 = require("@civ-clone/library-unit/Types");
const Yields_2 = require("@civ-clone/library-city/Yields");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
const unitDetails_1 = require("../lib/unitDetails");
class BuyDefender extends Strategy_1.default {
    constructor(playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) {
        super(ruleRegistry);
        _BuyDefender_playerTreasuryRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _BuyDefender_playerTreasuryRegistry, playerTreasuryRegistry, "f");
    }
    attempt(action) {
        if (!(action instanceof PlayerActions_1.ChangeProduction || action instanceof PlayerActions_1.CityBuild)) {
            return false;
        }
        const cityBuild = action.value(), [strongestDefender] = cityBuild
            .available()
            .filter((buildItem) => Object.prototype.isPrototypeOf.call(Types_1.Fortifiable, buildItem.item()))
            .sort((buildItemA, buildItemB) => 
        // Order by strongest `Defence`...
        (0, unitDetails_1.unitTypeYieldValue)(buildItemB.item(), Yields_1.Defence) -
            (0, unitDetails_1.unitTypeYieldValue)(buildItemA.item(), Yields_1.Defence) ||
            // ...then by `Attack`...
            (0, unitDetails_1.unitTypeYieldValue)(buildItemB.item(), Yields_1.Attack) -
                (0, unitDetails_1.unitTypeYieldValue)(buildItemA.item(), Yields_1.Attack) ||
            // ...and finally `Movement`.
            (0, unitDetails_1.unitTypeYieldValue)(buildItemB.item(), Yields_1.Movement) -
                (0, unitDetails_1.unitTypeYieldValue)(buildItemA.item(), Yields_1.Movement));
        cityBuild.build(strongestDefender.item());
        if (cityBuild.progress().value() >= cityBuild.cost().value()) {
            return true;
        }
        const playerTreasury = __classPrivateFieldGet(this, _BuyDefender_playerTreasuryRegistry, "f").getByPlayerAndType(cityBuild.city().player(), Yields_2.Gold), [spendCost] = playerTreasury
            .cost(cityBuild.city())
            .filter((spendCost) => spendCost.resource() === Yields_2.Gold);
        if (!spendCost || spendCost.value() > playerTreasury.value()) {
            return false;
        }
        playerTreasury.buy(cityBuild.city());
        return true;
    }
}
exports.BuyDefender = BuyDefender;
_BuyDefender_playerTreasuryRegistry = new WeakMap();
exports.default = BuyDefender;
//# sourceMappingURL=BuyDefender.js.map