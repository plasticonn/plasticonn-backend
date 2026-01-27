export const exportToGeoJSON = (centers: any[], name: string) => {
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
