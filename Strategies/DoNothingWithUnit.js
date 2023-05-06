"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoNothingWithUnit = void 0;
const PlayerActions_1 = require("@civ-clone/library-unit/PlayerActions");
const Actions_1 = require("@civ-clone/library-unit/Actions");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
class DoNothingWithUnit extends Strategy_1.default {
    attempt(action) {
        if (!(action instanceof PlayerActions_1.ActiveUnit || action instanceof PlayerActions_1.InactiveUnit)) {
            return false;
        }
        console.log('DoNothingWithUnit');
        const unit = action.value();
        unit.action(new Actions_1.NoOrders(unit.tile(), unit.tile(), unit, this.ruleRegistry()));
        return true;
    }
}
exports.DoNothingWithUnit = DoNothingWithUnit;
exports.default = DoNothingWithUnit;
//# sourceMappingURL=DoNothingWithUnit.js.map