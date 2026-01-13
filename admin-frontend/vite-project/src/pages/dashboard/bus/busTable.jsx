import { useState } from "react";

export default function BusTable({
  buses,
  getRouteName,
  onEdit,
  onDelete,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentBuses = buses.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(buses.length / itemsPerPage);

  return (
    <div className="table-section">
      <table className="bus-table" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Bus Number</th>
            <th>Type</th>
            <th>Total Seats</th>
            <th>Route</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentBuses.length === 0 ? (
            <tr>
              <td colSpan="5">No buses found</td>
            </tr>
          ) : (
            currentBuses.map((bus) => (
              <tr key={bus.busId}>
                <td>{bus.busNumber}</td>
                <td>{bus.busType}</td>
                <td>{bus.totalSeats}</td>
                <td>{getRouteName(bus.routeId)}</td>
                <td>
                  <button onClick={() => onEdit(bus)}>Edit</button>
                  <button onClick={() => onDelete(bus.busId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {buses.length > itemsPerPage && (
        <div className="pagination-arrows">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}className="arrow-btn"
          >
            ◀
          </button>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}className="arrow-btn"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
