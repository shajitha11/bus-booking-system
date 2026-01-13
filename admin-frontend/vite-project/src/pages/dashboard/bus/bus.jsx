import { useEffect, useState } from "react";

import {
    getAllBuses,
    createBus,
    updateBus,
    deleteBus,
    getAllRoutes,
} from "../../../services/api"

import BusForm from "./BusForm";
import BusTable from "./BusTable";

export default function Bus() {
    const token = localStorage.getItem("mainToken");

    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [form, setForm] = useState({
        busId: null,
        busNumber:"",
        busType: "AC",
        seat_rows: "",
        seat_columns: "",
        routeId: "",
    });

    useEffect(()=>{
        fetchRoutes();
        fetchBuses();
    }, []);

    async function fetchRoutes() {
        const res = await getAllRoutes(token);
        if (res.success) setRoutes(res.data);
    }

    async function fetchBuses() {
        const res = await getAllBuses(token);
        if (res.success) setBuses(res.data);
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
            await createBus(payload, token);
        }

        resetForm();
        fetchBuses();
    }

    function handleEdit(bus) {
        setForm({
            busId: bus.busId,
            busNumber: bus.busNumber,
            busType: bus.busType,
            seat_rows: String(bus.seat_rows),
            seat_columns: String(bus.seat_columns),
            routeId: bus.routeId,
        });
    }

    async function handleDelete(busId) {
        if (!window.confirm("Delete this bus?")) return;
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

    function getRouteName(routeId) {
        if (!routes || routes.length === 0) return "";
        
        const route = routes.find(
            (r) => r.routeId === Number(routeId)
        );
        return route
            ? `${route.sourceDistrictName}---${route.destinationDistrictName}`
            : "";
    }

    return (
        <div className="bus">
            <h2>Bus Management</h2>

            <div className="bus-layout">
                <BusForm
                    form={form}
                    routes={routes}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                />

                <BusTable
                    buses={buses}
                    getRouteName={getRouteName}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}