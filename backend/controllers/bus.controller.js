const db = require("../config/db");
const query = require("../queries/bus.query");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const verifyAnyUserToken = require("../middleware/verifyAnyUserToken");
const bookingQuery = require("../queries/booking.query");
const verifyCustomerToken = require("../middleware/verifyCustomerToken");

async function createBus(req, res) {
    try {
        const { busNumber, busType, seat_rows, seat_columns, routeId } = req.body;

        if (!busNumber || !busType || !seat_rows || !seat_columns || !routeId)
            return res.status(400).json({ success: false, error: "All fields are required" });

        const totalSeats = seat_rows * seat_columns;
        await db.query(query.createBus, [busNumber, busType, seat_rows, seat_columns, totalSeats, routeId]);
        return res.status(201).json({ success: true, message: "Bus created successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

async function getAllBuses(req, res) {
    try {
        const [rows] = await db.query(query.getAllBuses);
        return res.json({ success: true, data: rows });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

async function updateBus(req, res) {
    try {
        const { busId } = req.params;
        const { busNumber, busType, seat_rows, seat_columns, routeId } = req.body;

        if (!busNumber || !busType || !seat_rows || !seat_columns || !routeId) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const totalSeats = seat_rows * seat_columns;
        const [result] = await db.query(query.updateBus, [busNumber, busType, seat_rows, seat_columns, totalSeats, routeId, busId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Bus not found" });
        }
        return res.status(200).json({ success: true, message: "Bus updated successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

async function deleteBus(req, res) {
    try {
        const { busId } = req.params;
        const [result] = await db.query(query.deleteBus, [busId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Bus not found" });
        }
        return res.status(200).json({ success: true, message: "Bus deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

async function getBusSeatStatus(req, res) {
    const { busId } = req.params;
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: "Travel date required" });
    }

    const [busRes] = await db.query(query.getSeatLayout, [busId]);
console.log(bookingQuery.getBookedSeats)
console.log([busId, date])
    const [seatRes] = await db.query(bookingQuery.getBookedSeats, [busId, date]);
console.log(seatRes)
    return res.json({
        rows: busRes[0].seat_rows,
        columns: busRes[0].seat_columns,
        totalSeats: busRes[0].totalSeats,
        bookedSeats: seatRes.map(s => s.seatNumber)
    })
}

function busRoutes(app) {
    app.get("/api/bus", verifyAnyUserToken, getAllBuses);
    app.post("/api/bus/create", verifyAdminToken, createBus);
    app.put("/api/bus/edit/:busId", verifyAdminToken, updateBus);
    app.delete("/api/bus/delete/:busId", verifyAdminToken, deleteBus);
    app.get("/api/bus/:busId/seats", verifyCustomerToken, getBusSeatStatus);
}
module.exports = busRoutes;