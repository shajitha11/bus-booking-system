import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllDistricts,
  updateRoute,
  getAllRoutes,
} from "../../../services/api";

export default function EditRoute() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem("mainToken");

  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState({
    sourceDistrictId: "",
    destinationDistrictId: "",
  });

  useEffect(() => {
    fetchDistricts();
    fetchRouteDetails();
  }, []);

  async function fetchDistricts() {
    const res = await getAllDistricts(token);
    if (res.success) setDistricts(res.data);
  }

  async function fetchRouteDetails() {
    const res = await getAllRoutes(token);
    if (res.success) {
      const route = res.data.find((r) => r.routeId == id);
      if (!route) {
        alert("Route not found");
        navigate("/dashboard/route");
        return;
      }

      setForm({
        sourceDistrictId: route.sourceDistrictId,
        destinationDistrictId: route.destinationDistrictId,
      });
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.sourceDistrictId === form.destinationDistrictId) {
      alert("Source & Destination should not be same");
      return;
    }

    await updateRoute(id, form, token);
    navigate("/dashboard/route");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Route</h3>

      <select
        name="sourceDistrictId"
        value={form.sourceDistrictId}
        onChange={handleChange}
        required
      >
        <option value="">Source</option>
        {districts.map((d) => (
          <option key={d.districtId} value={d.districtId}>
            {d.districtName}
          </option>
        ))}
      </select>

      <select
        name="destinationDistrictId"
        value={form.destinationDistrictId}
        onChange={handleChange}
        required
      >
        <option value="">Destination</option>
        {districts.map((d) => (
          <option key={d.districtId} value={d.districtId}>
            {d.districtName}
          </option>
        ))}
      </select>

      <button type="submit">Update</button>
      <button type="button" onClick={() => navigate(-1)}>
        Cancel
      </button>
    </form>
  );
}
