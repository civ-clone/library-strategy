import {
  Attack,
  Defence,
  Movement,
  Visibility,
} from '@civ-clone/core-unit/Yields';
import { BaseYield, Yield } from '@civ-clone/core-unit/Rules/Yield';
import {
  PathFinderRegistry,
  instance as pathFinderRegistryInstance,
} from '@civ-clone/core-world-path/PathFinderRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  StrategyNoteRegistry,
  instance as strategyNoteRegistryInstance,
} from '@civ-clone/core-strategy/StrategyNoteRegistry';
import {
  UnitImprovementRegistry,
  instance as unitImprovementRegistryInstance,
} from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import Action from '@civ-clone/core-unit/Action';
import { Fortified } from '@civ-clone/library-unit/UnitImprovements';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import YieldValue from '@civ-clone/core-yield/Yield';
import { generateKey } from '@civ-clone/core-strategy/StrategyNote';

const unitTypeYieldCache = new Map<string, number>();

export const isUnitFortified = (
  unit: Unit,
  unitImprovementRegistry: UnitImprovementRegistry = unitImprovementRegistryInstance
): boolean =>
  unitImprovementRegistry
    .getByUnit(unit)
    .some((improvement) => improvement instanceof Fortified);

export const scoreUnit = (
  unit: Unit,
  YieldTypes: (typeof YieldValue)[] = [Attack, Defence, Movement, Visibility],
  ruleRegistry: RuleRegistry = ruleRegistryInstance
) =>
  YieldTypes.reduce(
    (total, YieldType: typeof YieldValue) =>
      total + unitYieldValue(unit, YieldType, ruleRegistry),
    0
  );

export const unitYieldValue = (
  unit: Unit,
  YieldType: typeof YieldValue,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
) => {
  const unitYield = new YieldType();

  ruleRegistry.process(Yield, unit, unitYield);

  return unitYield.value();
};

export const unitTypeYieldValue = (
  UnitType: typeof Unit,
  YieldType: typeof YieldValue,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): number => {
  const key = [UnitType.name, YieldType.name].join('-');

  if (!unitTypeYieldCache.has(key)) {
    const unitYield = new YieldType();

    ruleRegistry.process(BaseYield, UnitType, unitYield);

    unitTypeYieldCache.set(key, unitYield.value());
  }

  return unitTypeYieldCache.get(key)!;
};

export const unitCanActionAtTile = (
  unit: Unit,
  ActionType: typeof Action,
  to: Tile = unit.tile(),
  from: Tile = unit.tile()
) => unit.actions(to, from).some((action) => action instanceof ActionType);

export const isCityDefender = (
  unit: Unit,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  unitImprovementRegistry: UnitImprovementRegistry = unitImprovementRegistryInstance
): boolean =>
  unitYieldValue(unit, Defence, ruleRegistry) > 0 &&
  isUnitFortified(unit, unitImprovementRegistry);

export const canPathTo = (
  unit: Unit,
  target: Tile,
  pathFinderRegistry: PathFinderRegistry = pathFinderRegistryInstance
) => {
  const [PathFinder] = pathFinderRegistry.entries();

  if (!PathFinder) {
    console.warn('No PathFinder available.');

    return false;
  }

  const pathFinder = new PathFinder(unit, unit.tile(), target),
    path = pathFinder.generate();

  return !!path;
};

export const existingStrategy = (
  unit: Unit,
  strategyNoteRegistry: StrategyNoteRegistry = strategyNoteRegistryInstance
) => strategyNoteRegistry.getByKey(generateKey(unit, 'strategy'));
