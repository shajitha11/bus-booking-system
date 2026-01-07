import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllDistricts,
    getAllRoutes,
    getAllBuses,
    createBooking,
} from "../services/api";

function SearchBus() {
    const navigate = useNavigate();
    const token = localStorage.getItem("mainToken");

    const [districts, setDistricts] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [toDistricts, setToDistricts] = useState([]);
    const [travelDate, setTravelDate] = useState("");
    const [resultBuses, setResultBuses] = useState([]);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (!token) {
            alert("please login again");
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const d = await getAllDistricts(token);
            const r = await getAllRoutes(token);
            const b = await getAllBuses(token);

            setDistricts(d.data || []);
            setRoutes(r.data || []);
            setBuses(b.data || []);
        } catch (err) {
            console.error("Error loading data", err);
        }
    };

    const searchBus = () => {
        const fromId = Number(from);
        const toId = Number(to);

        setSearched(true);

        if (!fromId || !toId) {
            alert("Please select From and To district");
            return;
        }

        if (fromId === toId) {
            alert("From and To district same ah iruka kudadhu");
            return;
        }

        const matchedRoutes = routes.filter(
            (r) =>
                r.sourceDistrictId === fromId &&
                r.destinationDistrictId === toId
        );

        const routeIds = matchedRoutes.map(r => r.routeId);

        const matchedBuses = buses.filter(
            b => routeIds.includes(b.routeId)
        );

        setResultBuses(matchedBuses);
    };

    const handleBooking = async (busId) => {
        if (!travelDate) {
            alert("Please select travel date");
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        if (travelDate < today) {
            alert("Travel date cannot be in the past");
            return;
        }

        try {
            const res = await createBooking({ busId, travelDate }, token);
            alert(res.message || "Booking successful");
            navigate("/dashboard/myBooking");
        } catch (err) {
            alert(err.message || "Booking failed");
        }
    };

    return (
        <div className="search-bus">
            <form className="search-form">
                <select value={from} onChange={(e) => {
                    const selectedFrom = Number(e.target.value);
                    setFrom(selectedFrom);
                    setTo("");

                    const connectedRoutes = routes.filter(
                        r => r.sourceDistrictId === selectedFrom
                    );

                    const destinationIds = connectedRoutes.map(
                        r => r.destinationDistrictId
                    );

                    const filteredToDistricts = districts.filter(
                        d => destinationIds.includes(d.districtId)
                    );
                    setToDistricts(filteredToDistricts);
                }}
                >
                    <option value="">From District</option>
                    {districts.map(d => (
                        <option key={d.districtId} value={d.districtId}>
                            {d.districtName}
                        </option>
                    ))}
                </select>

                <select value={to} onChange={(e) => setTo(e.target.value)}>
                    <option value="">To District</option>
                    {toDistricts.map(d => (
                        <option key={d.districtId} value={d.districtId}>
                            {d.districtName}
                        </option>
                    ))}
                </select>


                <input type="date" value={travelDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setTravelDate(e.target.value)} />


                <button type="button" onClick={searchBus}>Search</button>

            </form>


            <div className="avail-bus">
                <h3>Available Buses</h3>
                {searched && resultBuses.length === 0 && (
                    <p>No buses found</p>
                )}

                {resultBuses.map(bus => (
                    <div className="showing-bus"
                        key={bus.busId}
                    >
                        <p><b>Bus No:</b> {bus.busNumber}</p>
                        <p><b>Type:</b> {bus.busType}</p>
                        <p><b>Total Seats:</b> {bus.totalSeats}</p>
                        <button onClick={() => handleBooking(bus.busId)}>
                            Book Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchBus;
