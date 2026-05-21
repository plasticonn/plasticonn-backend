"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToGeoJSON = void 0;
const exportToGeoJSON = (centers, name) => {
    const geojson = {
        type: "FeatureCollection",
        features: centers.map((c) => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: c.gps.coordinates,
            },
            properties: {
                centerId: c.centerId,
                name: c.name,
                type: c.type,
                status: c.status,
            },
        })),
    };
    return {
        name: `${name}.geojson`,
        contentType: "application/geo+json",
        buffer: Buffer.from(JSON.stringify(geojson)),
    };
};
exports.exportToGeoJSON = exportToGeoJSON;
