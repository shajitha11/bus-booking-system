const db = require("../config/db");
const query = require("../queries/route.query");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const verifyAnyUserToken = require("../middleware/verifyAnyUserToken");

async function createRoute(req, res) {
    try {
        const { sourceDistrictId, destinationDistrictId } = req.body;

        if (!sourceDistrictId || !destinationDistrictId)
            return res.status(400).json({ success: false, error: "All fields are required" });

        if (sourceDistrictId === destinationDistrictId)
            return res.status(400).json({ success: false, error: "Source and Destination cannot be same" });

        await db.query(query.createRoute, [sourceDistrictId, destinationDistrictId])
        return res.status(201).json({ success: true, messgae: "Route created successfully!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}

async function getAllRoutes(req, res) {
    try {
        const [rows] = await db.query(query.getAllRoutes);
        return res.json({ success: true, data: rows });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

async function updateRoute(req, res) {
    try {
        const { routeId } = req.params;
        const { sourceDistrictId, destinationDistrictId } = req.body;

        if (!sourceDistrictId || !destinationDistrictId)
            return res.status(400).json({ success: false, error: "All fields are required" });

        const [result] = await db.query(query.updateRoute, [sourceDistrictId, destinationDistrictId, routeId]);
        if (result.affectedRows === 0)
            return res.status(400).json({ success: false, error: "Route not found" });

        return res.status(200).json({ success: true, message: "Route updated successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}


async function deleteRoute(req, res) {
    try {
        const { routeId } = req.params;

        const [result] = await db.query(query.deleteRoute, [routeId]);
        if (result.affectedRows === 0)
            return res.status(404).json({ success: false, error: "Route not found" });
        return res.status(200).json({ success: true, message: "route deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

function routeRoutes(app) {
    app.get("/api/route", verifyAnyUserToken, getAllRoutes);
    app.post("/api/route/create", verifyAdminToken, createRoute);
    app.put("/api/route/edit/:routeId", verifyAdminToken, updateRoute);
    app.delete("/api/route/delete/:routeId", verifyAdminToken, deleteRoute);
}

module.exports = routeRoutes;