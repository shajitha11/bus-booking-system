const db = require("../config/db");
const query = require("../queries/booking.query");
const busQuery = require("../queries/bus.query");

const verifyCustomerToken = require("../middleware/verifyCustomerToken");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const verifyAnyUserToken = require("../middleware/verifyAnyUserToken");

async function createBooking(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const userId = req.user.userId;
    const { busId, travelDate } = req.body;

    if (!busId || !travelDate) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    const [countResult] = await db.query(query.getBookedCount, [busId, travelDate]);
    const bookedCount = countResult[0].bookedCount;

    const [busResult] = await db.query(busQuery.getSeatLayout, [busId]);
    const rows = busResult[0].seat_rows;
    const columns = busResult[0].seat_columns;

    const totalSeats = rows * columns;

    if (bookedCount >= totalSeats) {
      return res.status(400).json({
        success: false,
        error: "Bus is full"
      });
    }

    const seatIndex = bookedCount;
    const rowIndex = Math.floor(seatIndex / columns);
    const colIndex = seatIndex % columns;

    const rowLetter = String.fromCharCode(65 + rowIndex);
    const seatNumber = `${rowLetter}${colIndex + 1}`;

    await db.query(query.createBooking, [
      userId,
      busId,
      travelDate,
      seatNumber]);


    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      seatNumber
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function getAllBookings(req, res) {
  try {
    const [rows] = await db.query(query.getAllBookings);
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function getMyBookings(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const userId = req.user.userId;

    const [rows] = await db.query(query.getBookingsByUser, [userId]);
    return res.json({ success: true, data: rows });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function getBookingById(req, res) {
  try {
    const { bookingId } = req.params;
    const user = req.user;

    const [rows] = await db.query(query.getBookingById, [bookingId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    const booking = rows[0];

    if (user.role === "CUSTOMER" && booking.userId !== user.userId) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    return res.json({ success: true, data: booking });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function updateBookingStatus(req, res) {
  try {
    const { bookingId } = req.params;
    const { bookingStatus } = req.body;
    const user = req.user;

    if (!["CONFIRMED", "CANCELLED"].includes(bookingStatus)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid booking status" });
    }

    if (user.role === "CUSTOMER" && bookingStatus !== "CANCELLED") {
      return res
        .status(403)
        .json({ success: false, error: "Only cancellation allowed" });
    }

    const [result] = await db.query(query.updateBookingStatus, [
      bookingStatus,
      bookingId,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    return res.json({
      success: true,
      message: "Booking status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function deleteBooking(req, res) {
  try {
    const { bookingId } = req.params;

    const [result] = await db.query(query.deleteBooking, [bookingId]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    return res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

function bookingRoutes(app) {
  app.get("/api/booking/my", verifyCustomerToken, getMyBookings);
  app.get("/api/booking", verifyAdminToken, getAllBookings);
  app.get("/api/booking/:bookingId", verifyAnyUserToken, getBookingById);
  app.post("/api/booking", verifyCustomerToken, createBooking);
  app.put("/api/booking/edit/:bookingId/status", verifyAnyUserToken, updateBookingStatus);
  app.delete("/api/booking/delete/:bookingId", verifyAdminToken, deleteBooking);
}

module.exports = bookingRoutes;
