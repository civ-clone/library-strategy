"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveUnitRandomly = void 0;
const PlayerActions_1 = require("@civ-clone/library-unit/PlayerActions");
const Actions_1 = require("@civ-clone/library-unit/Actions");
const Strategy_1 = require("@civ-clone/core-strategy/Strategy");
class MoveUnitRandomly extends Strategy_1.default {
    attempt(action) {
        if (!(action instanceof PlayerActions_1.ActiveUnit || action instanceof PlayerActions_1.InactiveUnit)) {
            return false;
        }
        const unit = action.value(), [unitAction] = unit.tile().getNeighbours().flatMap((tile) => unit.actions(tile).filter((action) => action.sourceClass() === Actions_1.Move))
            .sort(() => Math.floor((Math.random() * 3)) - 1);
        if (!unitAction) {
            return false;
        }
        unit.action(unitAction);
        return true;
    }
}
exports.MoveUnitRandomly = MoveUnitRandomly;
exports.default = MoveUnitRandomly;
//# sourceMappingURL=MoveUnitRandomly.js.map