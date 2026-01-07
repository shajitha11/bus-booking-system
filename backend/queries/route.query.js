module.exports = {
  createRoute: `
    INSERT INTO route (sourceDistrictId, destinationDistrictId)
    VALUES (?, ?)
  `,

  getAllRoutes: `
    SELECT 
      r.routeId,
      sd.districtName AS sourceDistrictName,
      dd.districtName AS destinationDistrictName,
      r.sourceDistrictId,
      r.destinationDistrictId
    FROM route r
    JOIN district sd ON r.sourceDistrictId = sd.districtId
    JOIN district dd ON r.destinationDistrictId = dd.districtId
    WHERE r.deletedAt IS NULL
  `,

  updateRoute: `
    UPDATE route
    SET sourceDistrictId = ?, destinationDistrictId = ?
    WHERE routeId = ? AND deletedAt IS NULL
  `,

  deleteRoute: `
    UPDATE route
    SET deletedAt = NOW()
    WHERE routeId = ? AND deletedAt IS NULL
  `
};


