import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  Desert,
  Grassland,
  Hills,
  Mountains,
  Plains,
  River,
} from '@civ-clone/library-world/Terrains';
import {
  Irrigation,
  Mine,
  Railroad,
  Road,
} from '@civ-clone/library-world/TileImprovements';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Player from '@civ-clone/core-player/Player';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';

export const isACityTile = (
    tile: Tile,
    player: Player,
    cityRegistry: CityRegistry = cityRegistryInstance
  ) =>
    cityRegistry
      .getByPlayer(player)
      .some((city) => city.tiles().includes(tile)),
  shouldIrrigate = (
    tile: Tile,
    player: Player,
    cityRegistry: CityRegistry = cityRegistryInstance,
    tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
  ): boolean => {
    return (
      [Desert, Plains, Grassland, River].some(
        (TerrainType) => tile.terrain() instanceof TerrainType
      ) &&
      // TODO: doing this a lot already, need to make improvements a value object with a helper method
      !tileImprovementRegistry
        .getByTile(tile)
        .some(
          (improvement: TileImprovement): boolean =>
            improvement instanceof Irrigation
        ) &&
      isACityTile(tile, player, cityRegistry) &&
      [...tile.getAdjacent(), tile].some(
        (tile: Tile): boolean =>
          tile.terrain() instanceof River ||
          tile.isCoast() ||
          (tileImprovementRegistry
            .getByTile(tile)
            .some(
              (improvement: TileImprovement): boolean =>
                improvement instanceof Irrigation
            ) &&
            cityRegistry.getByTile(tile) === null)
      )
    );
  },
  shouldMine = (
    tile: Tile,
    player: Player,
    cityRegistry: CityRegistry = cityRegistryInstance,
    tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
  ): boolean => {
    return (
      [Hills, Mountains].some(
        (TerrainType: typeof Terrain): boolean =>
          tile.terrain() instanceof TerrainType
      ) &&
      !tileImprovementRegistry
        .getByTile(tile)
        .some(
          (improvement: TileImprovement): boolean => improvement instanceof Mine
        ) &&
      isACityTile(tile, player, cityRegistry)
    );
  },
  shouldRoad = (
    tile: Tile,
    player: Player,
    cityRegistry: CityRegistry = cityRegistryInstance,
    tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
  ): boolean => {
    return (
      !tileImprovementRegistry
        .getByTile(tile)
        .some(
          (improvement: TileImprovement): boolean => improvement instanceof Road
        ) && isACityTile(tile, player, cityRegistry)
    );
  },
  shouldRailroad = (
    tile: Tile,
    player: Player,
    cityRegistry: CityRegistry = cityRegistryInstance,
    tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
  ): boolean => {
    return (
      tileImprovementRegistry
        .getByTile(tile)
        .some(
          (improvement: TileImprovement): boolean => improvement instanceof Road
        ) &&
      !tileImprovementRegistry
        .getByTile(tile)
        .some(
          (improvement: TileImprovement): boolean =>
            improvement instanceof Railroad
        ) &&
      isACityTile(tile, player, cityRegistry)
    );
  };
