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
var _ChooseResearch_strategyRegistry, _ChooseResearch_traitRegistry, _ChooseResearch_randomNumberGenerator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseResearch = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const StrategyRegistry_1 = require("@civ-clone/core-strategy/StrategyRegistry");
const TraitRegistry_1 = require("@civ-clone/core-civilization/TraitRegistry");
const ChoiceMeta_1 = require("@civ-clone/core-client/ChoiceMeta");
const ChooseFromList_1 = require("@civ-clone/core-strategy-ai-client/PlayerActions/ChooseFromList");
const ChooseResearch_1 = require("@civ-clone/library-science/PlayerActions/ChooseResearch");
const Data_1 = require("@civ-clone/core-strategy-ai-client/PlayerActions/ChooseFromList/Data");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
class ChooseResearch extends Strategy_1.default {
    constructor(ruleRegistry = RuleRegistry_1.instance, strategyRegistry = StrategyRegistry_1.instance, traitRegistry = TraitRegistry_1.instance, randomNumberGenerator = () => Math.random()) {
        super(ruleRegistry);
        _ChooseResearch_strategyRegistry.set(this, void 0);
        _ChooseResearch_traitRegistry.set(this, void 0);
        _ChooseResearch_randomNumberGenerator.set(this, void 0);
        __classPrivateFieldSet(this, _ChooseResearch_strategyRegistry, strategyRegistry, "f");
        __classPrivateFieldSet(this, _ChooseResearch_traitRegistry, traitRegistry, "f");
        __classPrivateFieldSet(this, _ChooseResearch_randomNumberGenerator, randomNumberGenerator, "f");
    }
    attempt(action) {
        if (!(action instanceof ChooseResearch_1.default)) {
            return false;
        }
        const playerResearch = action.value(), chooseResearchData = new Data_1.default(new ChoiceMeta_1.default(playerResearch.available(), 'choose-research'));
        __classPrivateFieldGet(this, _ChooseResearch_strategyRegistry, "f").attempt(new ChooseFromList_1.default(action.player(), chooseResearchData));
        if (!chooseResearchData.value()) {
            throw new Error(`Unhandled: ${this.constructor.name}`);
        }
        playerResearch.research(chooseResearchData.value());
        return true;
    }
}
exports.ChooseResearch = ChooseResearch;
_ChooseResearch_strategyRegistry = new WeakMap(), _ChooseResearch_traitRegistry = new WeakMap(), _ChooseResearch_randomNumberGenerator = new WeakMap();
exports.default = ChooseResearch;
//# sourceMappingURL=ChooseResearch.js.map