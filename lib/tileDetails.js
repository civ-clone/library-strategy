"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRailroad = exports.shouldRoad = exports.shouldMine = exports.shouldIrrigate = exports.isACityTile = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Terrains_1 = require("@civ-clone/library-world/Terrains");
const TileImprovements_1 = require("@civ-clone/library-world/TileImprovements");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const isACityTile = (tile, player, cityRegistry = CityRegistry_1.instance) => cityRegistry
    .getByPlayer(player)
    .some((city) => city.tiles().includes(tile)), shouldIrrigate = (tile, player, cityRegistry = CityRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) => {
    return ([Terrains_1.Desert, Terrains_1.Plains, Terrains_1.Grassland, Terrains_1.River].some((TerrainType) => tile.terrain() instanceof TerrainType) &&
        // TODO: doing this a lot already, need to make improvements a value object with a helper method
        !tileImprovementRegistry
            .getByTile(tile)
            .some((improvement) => improvement instanceof TileImprovements_1.Irrigation) &&
        (0, exports.isACityTile)(tile, player, cityRegistry) &&
        [...tile.getAdjacent(), tile].some((tile) => tile.terrain() instanceof Terrains_1.River ||
            tile.isCoast() ||
            (tileImprovementRegistry
                .getByTile(tile)
                .some((improvement) => improvement instanceof TileImprovements_1.Irrigation) &&
                cityRegistry.getByTile(tile) === null)));
}, shouldMine = (tile, player, cityRegistry = CityRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) => {
    return ([Terrains_1.Hills, Terrains_1.Mountains].some((TerrainType) => tile.terrain() instanceof TerrainType) &&
        !tileImprovementRegistry
            .getByTile(tile)
            .some((improvement) => improvement instanceof TileImprovements_1.Mine) &&
        (0, exports.isACityTile)(tile, player, cityRegistry));
}, shouldRoad = (tile, player, cityRegistry = CityRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) => {
    return (!tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof TileImprovements_1.Road) && (0, exports.isACityTile)(tile, player, cityRegistry));
}, shouldRailroad = (tile, player, cityRegistry = CityRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) => {
    return (tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof TileImprovements_1.Road) &&
        !tileImprovementRegistry
            .getByTile(tile)
            .some((improvement) => improvement instanceof TileImprovements_1.Railroad) &&
        (0, exports.isACityTile)(tile, player, cityRegistry));
};
exports.isACityTile = isACityTile, exports.shouldIrrigate = shouldIrrigate, exports.shouldMine = shouldMine, exports.shouldRoad = shouldRoad, exports.shouldRailroad = shouldRailroad;
//# sourceMappingURL=tileDetails.js.map