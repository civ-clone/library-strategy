"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ChooseResearchFromList_handledKeys, _ChooseResearchFromList_randomNumberGenerator, _ChooseResearchFromList_traitRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseResearchFromList = void 0;
const Advances_1 = require("@civ-clone/library-science/Advances");
const Traits_1 = require("@civ-clone/library-civilization/Traits");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TraitRegistry_1 = require("@civ-clone/core-civilization/TraitRegistry");
const ChooseFromList_1 = require("@civ-clone/core-strategy-ai-client/PlayerActions/ChooseFromList");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
const playerHasTrait_1 = require("@civ-clone/library-civilization/lib/playerHasTrait");
// TODO: These should probably be more generically determined, probably via `Rule`s.
const keyTechnologies = [Advances_1.SpaceFlight, Advances_1.Automobile, Advances_1.Gunpowder, Advances_1.Industrialization];
// TODO: These should probably be more generically determined, probably via `Rule`s.
const priorities = new Map([
    [
        Traits_1.Civilized,
        [
            Advances_1.Alphabet,
            Advances_1.Astronomy,
            Advances_1.Banking,
            Advances_1.BridgeBuilding,
            Advances_1.CeremonialBurial,
            Advances_1.Chemistry,
            Advances_1.CodeOfLaws,
            Advances_1.Computers,
            Advances_1.Construction,
            Advances_1.Corporation,
            Advances_1.Currency,
            Advances_1.Democracy,
            Advances_1.Electricity,
            Advances_1.Electronics,
            Advances_1.Engineering,
            Advances_1.Industrialization,
            Advances_1.Invention,
            Advances_1.Literacy,
            Advances_1.Masonry,
            Advances_1.Mathematics,
            Advances_1.Medicine,
            Advances_1.Monarchy,
            Advances_1.Mysticism,
            Advances_1.Navigation,
            Advances_1.Philosophy,
            Advances_1.Physics,
            Advances_1.Pottery,
            Advances_1.Railroad,
            Advances_1.Religion,
            Advances_1.SpaceFlight,
            Advances_1.TheRepublic,
            Advances_1.TheoryOfGravity,
            Advances_1.Trade,
            Advances_1.University,
            Advances_1.Writing,
        ],
    ],
    [
        Traits_1.Perfectionist,
        [
            Advances_1.Banking,
            Advances_1.BridgeBuilding,
            Advances_1.CeremonialBurial,
            Advances_1.CodeOfLaws,
            Advances_1.Currency,
            Advances_1.GeneticEngineering,
            Advances_1.Industrialization,
            Advances_1.Masonry,
            Advances_1.Medicine,
            Advances_1.Monarchy,
            Advances_1.NuclearPower,
            Advances_1.Pottery,
            Advances_1.Recycling,
            Advances_1.Religion,
            Advances_1.Robotics,
            Advances_1.TheRepublic,
            Advances_1.Trade,
            Advances_1.University,
            Advances_1.Writing,
        ],
    ],
    [
        Traits_1.Expansionist,
        [
            Advances_1.AdvancedFlight,
            Advances_1.Astronomy,
            Advances_1.Communism,
            Advances_1.Gunpowder,
            Advances_1.HorsebackRiding,
            Advances_1.Industrialization,
            Advances_1.Magnetism,
            Advances_1.MapMaking,
            Advances_1.Medicine,
            Advances_1.Monarchy,
            Advances_1.Mysticism,
            Advances_1.Navigation,
            Advances_1.Railroad,
            Advances_1.Religion,
            Advances_1.SteamEngine,
            Advances_1.TheWheel,
            Advances_1.Trade,
        ],
    ],
    [
        Traits_1.Militaristic,
        [
            Advances_1.AdvancedFlight,
            Advances_1.Automobile,
            Advances_1.BronzeWorking,
            Advances_1.Chivalry,
            Advances_1.Conscription,
            Advances_1.Flight,
            Advances_1.Gunpowder,
            Advances_1.HorsebackRiding,
            Advances_1.IronWorking,
            Advances_1.LaborUnion,
            Advances_1.Magnetism,
            Advances_1.MapMaking,
            Advances_1.MassProduction,
            Advances_1.Mathematics,
            Advances_1.Metallurgy,
            Advances_1.Navigation,
            Advances_1.Robotics,
            Advances_1.Rocketry,
            Advances_1.SteamEngine,
            Advances_1.Steel,
            Advances_1.TheWheel,
        ],
    ],
]);
class ChooseResearchFromList extends Strategy_1.default {
    constructor(handledKeys = [
        'capture-city.steal-advance',
        'choose-research',
        'diplomacy.exchange-knowledge',
    ], ruleRegistry = RuleRegistry_1.instance, traitRegistry = TraitRegistry_1.instance, randomNumberGenerator = () => Math.random()) {
        super(ruleRegistry);
        _ChooseResearchFromList_handledKeys.set(this, []);
        _ChooseResearchFromList_randomNumberGenerator.set(this, void 0);
        _ChooseResearchFromList_traitRegistry.set(this, void 0);
        __classPrivateFieldGet(this, _ChooseResearchFromList_handledKeys, "f").push(...handledKeys);
        __classPrivateFieldSet(this, _ChooseResearchFromList_randomNumberGenerator, randomNumberGenerator, "f");
        __classPrivateFieldSet(this, _ChooseResearchFromList_traitRegistry, traitRegistry, "f");
    }
    attempt(action) {
        if (!(action instanceof ChooseFromList_1.default)) {
            return false;
        }
        const listData = action.value();
        if (!__classPrivateFieldGet(this, _ChooseResearchFromList_handledKeys, "f").includes(listData.meta().key())) {
            return false;
        }
        const list = listData
            .meta()
            .choices()
            .map((choice) => choice.value()), keyTechs = list.filter((AdvanceType) => keyTechnologies.includes(AdvanceType));
        if (keyTechs.length) {
            listData.choose(this.pickRandomFromList(keyTechs));
            return true;
        }
        const topPriority = Array.from(priorities.entries())
            .flatMap(([TraitType, advances]) => {
            if ((0, playerHasTrait_1.playerHasTrait)(action.player(), TraitType, __classPrivateFieldGet(this, _ChooseResearchFromList_traitRegistry, "f"))) {
                return advances;
            }
            return [];
        })
            .filter((AdvanceType) => list.includes(AdvanceType));
        if (topPriority.length) {
            listData.choose(this.pickRandomFromList(topPriority));
            return true;
        }
        listData.choose(this.pickRandomFromList(list));
        return true;
    }
    pickRandomFromList(list) {
        return list[Math.floor(list.length * __classPrivateFieldGet(this, _ChooseResearchFromList_randomNumberGenerator, "f").call(this))];
    }
}
exports.ChooseResearchFromList = ChooseResearchFromList;
_ChooseResearchFromList_handledKeys = new WeakMap(), _ChooseResearchFromList_randomNumberGenerator = new WeakMap(), _ChooseResearchFromList_traitRegistry = new WeakMap();
exports.default = ChooseResearchFromList;
//# sourceMappingURL=ChooseResearchFromList.js.map