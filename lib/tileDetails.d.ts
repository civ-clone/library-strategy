import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
export declare const isACityTile: (
    tile: Tile,
    player: Player,
    cityRegistry?: CityRegistry
  ) => boolean,
  shouldIrrigate: (
    tile: Tile,
    player: Player,
    cityRegistry?: CityRegistry,
    tileImprovementRegistry?: TileImprovementRegistry
  ) => boolean,
  shouldMine: (
    tile: Tile,
    player: Player,
    cityRegistry?: CityRegistry,
    tileImprovementRegistry?: TileImprovementRegistry
  ) => boolean,
  shouldRoad: (
    tile: Tile,
    player: Player,
    cityRegistry?: CityRegistry,
    tileImprovementRegistry?: TileImprovementRegistry
  ) => boolean,
  shouldRailroad: (
    tile: Tile,
    player: Player,
    cityRegistry?: CityRegistry,
    tileImprovementRegistry?: TileImprovementRegistry
  ) => boolean;
