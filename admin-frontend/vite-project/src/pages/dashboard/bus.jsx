import { useEffect, useState } from "react";
import { getAllBuses, createBus, updateBus, deleteBus, getAllRoutes } from "../../services/api";

export default function Bus() {
    const token = localStorage.getItem("mainToken");
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [form, setForm] = useState({
        busId: null,
        busNumber: "",
        busType: "AC",
        seat_rows: "",
        seat_columns: "",
        routeId: "",
    });

    useEffect(() => {
        fetchRoutes();
        fetchBuses();
    }, []);

    async function fetchRoutes() {
        const res = await getAllRoutes(token);
        if (res.success) {
            setRoutes(res.data);
        }
    }

    async function fetchBuses() {
        const res = await getAllBuses(token);
        if (res.success) {
            setBuses(res.data);
        }
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const totalSeats = Number(form.seat_rows) * Number(form.seat_columns);

        const payload = {
            busNumber: form.busNumber,
            busType: form.busType,
            seat_rows: Number(form.seat_rows),
            seat_columns: Number(form.seat_columns),
            totalSeats,
            routeId: form.routeId,
        };

        if (form.busId) {
            await updateBus(form.busId, payload, token);
        } else {
            await createBus(payload, token)
        }
        resetForm();
        fetchBuses();
    }

    function handleEdit(bus) {
        console.log("Editing bus:", bus);
        setForm({
            busId: bus.busId,
            busNumber: bus.busNumber,
            busType: bus.busType,
            seat_rows: bus.seat_rows !== undefined && bus.seat_rows !== null ? String(bus.seat_rows) : "",
            seat_columns: bus.seat_columns !== undefined && bus.seat_columns !== null ? String(bus.seat_columns) : "",
            routeId: bus.routeId,
        });
    }

    async function handleDelete(busId) {
        if (!window.confirm("Are you sure you want to delete this bus?")) return;
        await deleteBus(busId, token);
        fetchBuses();
    }

    function resetForm() {
        setForm({
            busId: null,
            busNumber: "",
            busType: "AC",
            seat_rows: "",
            seat_columns: "",
            routeId: "",
        });
    }


    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentBuses = buses.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(buses.length / itemsPerPage);

    function prevPage() {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    }

    function nextPage() {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    }

    function getRouteName(routeId) {
        const route = routes.find((r) => r.routeId === Number(routeId));
        return route
            ? `${route.sourceDistrictName} --- ${route.destinationDistrictName}`
            : routeId;
    }

    return (
        <div className="bus">
            <h2>Bus Management</h2>
            <div className="bus-layout">
                <form className="bus-form" onSubmit={handleSubmit}>
                    <h3>{form.busId ? "Edit Bus" : "Add Bus"}</h3>
                    <div className="i">
                        <input
                            type="text"
                            name="busNumber"
                            placeholder="Bus Number"
                            value={form.busNumber}
                            onChange={handleChange}
                            required
                        />

                        <select name="busType" value={form.busType} onChange={handleChange}>
                            <option value="AC">AC</option>
                            <option value="NON_AC">NON_AC</option>
                            <option value="SLEEPER">SLEEPER</option>
                        </select>

                        <input type="number" name="seat_rows" placeholder="Rows(eg:5)"
                            value={form.seat_rows} onChange={handleChange}
                            required />

                        <input type="number" name="seat_columns" placeholder="Columns(eg:4)"
                            value={form.seat_columns} onChange={handleChange}
                            required />


                        <select
                            name="routeId"
                            value={form.routeId}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Select Route
                            </option>
                            {routes.map((route) => (
                                <option key={route.routeId} value={route.routeId}>
                                    {route.sourceDistrictName} --- {route.destinationDistrictName}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="button-row">

                        <button type="button" onClick={resetForm}>
                            Cancel
                        </button>


                        <button type="submit">{form.busId ? "Update Bus" : "Add Bus"}</button>
                    </div>


                </form>

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
                                            <button onClick={() => handleEdit(bus)}>Edit</button>
                                            <button onClick={() => handleDelete(bus.busId)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {buses.length > itemsPerPage && (
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
            </div>
        </div>
    );
}