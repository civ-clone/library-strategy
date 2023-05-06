import { PathFinderRegistry } from '@civ-clone/core-world-path/PathFinderRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { StrategyNoteRegistry } from '@civ-clone/core-strategy/StrategyNoteRegistry';
import { UnitImprovementRegistry } from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import Action from '@civ-clone/core-unit/Action';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import YieldValue from '@civ-clone/core-yield/Yield';
export declare const isUnitFortified: (
  unit: Unit,
  unitImprovementRegistry?: UnitImprovementRegistry
) => boolean;
export declare const scoreUnit: (
  unit: Unit,
  YieldTypes?: (typeof YieldValue)[],
  ruleRegistry?: RuleRegistry
) => number;
export declare const unitYieldValue: (
  unit: Unit,
  YieldType: typeof YieldValue,
  ruleRegistry?: RuleRegistry
) => number;
export declare const unitTypeYieldValue: (
  UnitType: typeof Unit,
  YieldType: typeof YieldValue,
  ruleRegistry?: RuleRegistry
) => number;
export declare const unitCanActionAtTile: (
  unit: Unit,
  ActionType: typeof Action,
  to?: Tile,
  from?: Tile
) => boolean;
export declare const isCityDefender: (
  unit: Unit,
  ruleRegistry?: RuleRegistry,
  unitImprovementRegistry?: UnitImprovementRegistry
) => boolean;
export declare const canPathTo: (
  unit: Unit,
  target: Tile,
  pathFinderRegistry?: PathFinderRegistry
) => boolean;
export declare const existingStrategy: (
  unit: Unit,
  strategyNoteRegistry?: StrategyNoteRegistry
) =>
  | import('@civ-clone/core-strategy/StrategyNote').StrategyNote<any>
  | undefined;
