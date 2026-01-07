const db = require("../config/db");
const query = require("../queries/district.query");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const verifyAnyUserToken = require("../middleware/verifyAnyUserToken");

async function createDistrict(req, res) {
    try {
        const { districtName } = req.body;
        if (!districtName)
            return res.status(400).json({ success: false, error: "District name is required" });

        await db.query(query.createDistrict, [districtName]);
        return res.status(200).json({ success: true, message: "District created successfully!" });
    }
    catch (error) {
        console.error(error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ success: false, error: "District already exists" });
        }
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

async function getAllDistricts(req, res) {
    try {
        const [rows] = await db.query(query.getAllDistricts);
        return res.json({ success: true, data: rows });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

async function updateDistrict(req, res) {
    try {
        const { districtId } = req.params;
        const { districtName } = req.body;

        if (!districtName)
            return res.status(400).json({ success: false, error: "District name is required" });

        const [result] = await db.query(query.updateDistrict, [districtName, districtId]);
        if (result.affectedRows === 0)
            return res.status(404).json({ success: false, error: "District not found" });

        return res.status(200).json({ success: true, message: "District updated successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

async function deleteDistrict(req, res) {
    try {
        const { districtId } = req.params;
        const [result] = await db.query(query.deleteDistrict, [districtId]);

        if (result.affectedRows === 0)
            return res.status(404).json({ success: false, error: "District not found" });

        return res.status(200).json({ success: true, message: "District deleted successfully!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

function districtRoutes(app) {
    app.get("/api/district", verifyAnyUserToken, getAllDistricts);
    app.post("/api/district/create", verifyAdminToken, createDistrict);
    app.put("/api/district/edit/:districtId", verifyAdminToken, updateDistrict);
    app.delete("/api/district/delete/:districtId", verifyAdminToken, deleteDistrict);
}

module.exports = districtRoutes;