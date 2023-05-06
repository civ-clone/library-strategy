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
var _ChangeGovernment_playerGovernmentRegistry, _ChangeGovernment_traitRegistry, _ChangeGovernment_wonderRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeGovernment = void 0;
const Traits_1 = require("@civ-clone/library-civilization/Traits");
const Governments_1 = require("@civ-clone/library-government/Governments");
const Advances_1 = require("@civ-clone/library-science/Advances");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TraitRegistry_1 = require("@civ-clone/core-civilization/TraitRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const playerHasTrait_1 = require("@civ-clone/library-civilization/lib/playerHasTrait");
const PreProcessTurn_1 = require("../PlayerActions/PreProcessTurn");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
const Wonders_1 = require("@civ-clone/library-wonder/Wonders");
const playerHasWonder_1 = require("@civ-clone/library-wonder/lib/playerHasWonder");
const governmentToAdvance = new Map([
    [Governments_1.Communism, Advances_1.Communism],
    [Governments_1.Democracy, Advances_1.Democracy],
    [Governments_1.Despotism, null],
    [Governments_1.Monarchy, Advances_1.Monarchy],
    [Governments_1.Republic, Advances_1.TheRepublic],
]);
const supportedGovernments = [
    Governments_1.Democracy,
    Governments_1.Republic,
    Governments_1.Communism,
    Governments_1.Monarchy,
    Governments_1.Despotism,
];
class ChangeGovernment extends Strategy_1.default {
    constructor(playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, traitRegistry = TraitRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance) {
        super(ruleRegistry);
        _ChangeGovernment_playerGovernmentRegistry.set(this, void 0);
        _ChangeGovernment_traitRegistry.set(this, void 0);
        _ChangeGovernment_wonderRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _ChangeGovernment_playerGovernmentRegistry, playerGovernmentRegistry, "f");
        __classPrivateFieldSet(this, _ChangeGovernment_traitRegistry, traitRegistry, "f");
        __classPrivateFieldSet(this, _ChangeGovernment_wonderRegistry, wonderRegistry, "f");
    }
    attempt(action) {
        if (!(action instanceof PreProcessTurn_1.default)) {
            return false;
        }
        const playerGovernment = __classPrivateFieldGet(this, _ChangeGovernment_playerGovernmentRegistry, "f").getByPlayer(action.player());
        return supportedGovernments.some((GovernmentType) => {
            if (playerGovernment.is(GovernmentType)) {
                return true;
            }
            if (!playerGovernment.available().includes(GovernmentType) ||
                !this.shouldChooseGovernment(GovernmentType, action.player())) {
                return false;
            }
            playerGovernment.set(new GovernmentType());
            return true;
        });
    }
    shouldChooseGovernment(GovernmentType, player) {
        if ((0, playerHasTrait_1.playerHasTraits)(player, Traits_1.Civilized, Traits_1.Friendly, __classPrivateFieldGet(this, _ChangeGovernment_traitRegistry, "f"))) {
            return [Governments_1.Communism, Governments_1.Democracy, Governments_1.Despotism, Governments_1.Monarchy, Governments_1.Republic].includes(GovernmentType);
        }
        if ((0, playerHasTrait_1.playerHasTrait)(player, Traits_1.Civilized, __classPrivateFieldGet(this, _ChangeGovernment_traitRegistry, "f")) ||
            (0, playerHasWonder_1.playerHasWonder)(player, Wonders_1.WomensSuffrage, __classPrivateFieldGet(this, _ChangeGovernment_wonderRegistry, "f"))) {
            return [Governments_1.Despotism, Governments_1.Monarchy, Governments_1.Republic].includes(GovernmentType);
        }
        if ((0, playerHasTrait_1.playerHasTraits)(player, Traits_1.Aggressive, Traits_1.Militaristic, __classPrivateFieldGet(this, _ChangeGovernment_traitRegistry, "f")) ||
            (0, playerHasTrait_1.playerHasTraits)(player, Traits_1.Aggressive, Traits_1.Expansionist, __classPrivateFieldGet(this, _ChangeGovernment_traitRegistry, "f")) ||
            (0, playerHasTrait_1.playerHasTraits)(player, Traits_1.Militaristic, Traits_1.Expansionist, __classPrivateFieldGet(this, _ChangeGovernment_traitRegistry, "f"))) {
            return [Governments_1.Communism, Governments_1.Despotism, Governments_1.Monarchy].includes(GovernmentType);
        }
        return [Governments_1.Despotism, Governments_1.Monarchy].includes(GovernmentType);
    }
}
exports.ChangeGovernment = ChangeGovernment;
_ChangeGovernment_playerGovernmentRegistry = new WeakMap(), _ChangeGovernment_traitRegistry = new WeakMap(), _ChangeGovernment_wonderRegistry = new WeakMap();
exports.default = ChangeGovernment;
//# sourceMappingURL=ChangeGovernment.js.map