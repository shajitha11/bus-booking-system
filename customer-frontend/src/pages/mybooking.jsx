import { useEffect, useState } from "react";
import { getMyBookings, updateBookingStatus } from "../services/api";
function MyBookings() {
  const token = localStorage.getItem("mainToken");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getMyBookings(token);
      if (res.success && Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setBookings([]);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setLoading(true);
    try {
      const res = await updateBookingStatus(bookingId, "CANCELLED",token);
      if (res.success) {
        alert("Booking cancelled successfully");
         await loadBookings();
      } else {
        alert("Failed to cancel booking: " + (res.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error cancelling booking");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mybooking">
      {bookings.length === 0 && <p>No bookings yet</p>}

      {bookings.map((b) => (
        <div key={b.bookingId} className="booking-box">
          <p><b>Bus:</b> {b.busNumber}</p>
          <p><b>Date:</b> {b.travelDate}</p>
          <p><b>Seat Number:</b>{b.seatNumber||"N/A"}</p>
          <p><b>Status:</b> {b.bookingStatus}</p>

          {b.bookingStatus !== "CANCELLED" && (
            <button disabled={loading} onClick={() => cancelBooking(b.bookingId)}>
              Cancel Booking
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyBookings;
