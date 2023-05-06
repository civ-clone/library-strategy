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
var _ContinueOnPath_pathFinderRegistry, _ContinueOnPath_strategyNoteRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContinueOnPath = void 0;
const PathFinderRegistry_1 = require("@civ-clone/core-world-path/PathFinderRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const StrategyNoteRegistry_1 = require("@civ-clone/core-strategy/StrategyNoteRegistry");
const ActiveUnit_1 = require("@civ-clone/base-player-action-active-unit/ActiveUnit");
const Priority_1 = require("@civ-clone/core-rule/Priority");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
const GoTo_1 = require("@civ-clone/base-unit-action-goto/GoTo");
const moveAlongPath_1 = require("@civ-clone/base-unit-action-goto/lib/moveAlongPath");
class ContinueOnPath extends Strategy_1.default {
    constructor(pathFinderRegistry = PathFinderRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, strategyNoteRegistry = StrategyNoteRegistry_1.instance) {
        super(ruleRegistry);
        _ContinueOnPath_pathFinderRegistry.set(this, void 0);
        _ContinueOnPath_strategyNoteRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _ContinueOnPath_pathFinderRegistry, pathFinderRegistry, "f");
        __classPrivateFieldSet(this, _ContinueOnPath_strategyNoteRegistry, strategyNoteRegistry, "f");
    }
    attempt(action) {
        if (!(action instanceof ActiveUnit_1.default)) {
            return false;
        }
        const unit = action.value(), existingTargetNote = __classPrivateFieldGet(this, _ContinueOnPath_strategyNoteRegistry, "f").getByKey((0, GoTo_1.generateKey)(unit));
        if (!existingTargetNote) {
            return false;
        }
        const path = existingTargetNote.value();
        (0, moveAlongPath_1.default)(unit, path);
        return true;
    }
    /**
     * Fixed, really high, `Priority` to handle this scenario before anything else
     */
    priority(action) {
        return new Priority_1.default(0);
    }
}
exports.ContinueOnPath = ContinueOnPath;
_ContinueOnPath_pathFinderRegistry = new WeakMap(), _ContinueOnPath_strategyNoteRegistry = new WeakMap();
exports.default = ContinueOnPath;
//# sourceMappingURL=ContinueOnPath.js.map