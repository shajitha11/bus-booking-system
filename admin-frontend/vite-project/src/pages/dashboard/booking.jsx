import { useEffect, useState } from "react";
import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../../services/api";

export default function Booking() {
  const token = localStorage.getItem("mainToken");

  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    const res = await getAllBookings(token);
    if (res.success) setBookings(res.data);
  }

  async function handleStatusChange(bookingId, status) {
    await updateBookingStatus(
      bookingId,
      { bookingStatus: status },
      token
    );
    fetchBookings();
  }

  async function handleDelete(bookingId) {
    if (!window.confirm("Delete this booking?")) return;
    await deleteBooking(bookingId, token);
    fetchBookings();
  }

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentBookings = bookings.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  function prevPage() {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  }

  function nextPage() {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  }

  return (
    <div className="booking">
      <h2>Booking Management</h2>

      <table className="booking-table" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User</th>
            <th>Bus</th>
            <th>Route</th>
            <th>Travel Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentBookings.length === 0 ? (
            <tr>
              <td colSpan="7">No bookings found</td>
            </tr>
          ) : (
            currentBookings.map((b) => (
              <tr key={b.bookingId}>
                <td>{b.bookingId}</td>
                <td>{b.username}</td>
                <td>{b.busNumber}</td>
                <td>
                  {b.sourceDistrict} → {b.destinationDistrict}
                </td>
                <td>{b.travelDate}</td>
                <td>{b.bookingStatus}</td>
                <td>
                  <button
                    onClick={() =>
                      handleStatusChange(b.bookingId, "CONFIRMED")
                    }
                    disabled={b.bookingStatus === "CONFIRMED"}
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(b.bookingId, "CANCELLED")
                    }
                    disabled={b.bookingStatus === "CANCELLED"}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleDelete(b.bookingId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {bookings.length > itemsPerPage && (
        <div className="pagination-arrows">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="arrow-btn"
          >
            ◀
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="arrow-btn"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
