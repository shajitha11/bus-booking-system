import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoute, getAllDistricts } from "../../../services/api";

export default function AddRoute() {
  const token = localStorage.getItem("mainToken");
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState({
    sourceDistrictId: "",
    destinationDistrictId: "",
  });

  useEffect(() => {
    fetchDistricts();
  }, []);

  async function fetchDistricts() {
    const res = await getAllDistricts(token);
    if (res.success) setDistricts(res.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.sourceDistrictId === form.destinationDistrictId) {
      alert("Source & Destination same aagakoodaadhu");
      return;
    }

    await createRoute(form, token);
    navigate("/dashboard/route");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Route</h3>

      <select name="sourceDistrictId" onChange={handleChange} required>
        <option value="">Source</option>
        {districts.map(d => (
          <option key={d.districtId} value={d.districtId}>
            {d.districtName}
          </option>
        ))}
      </select>

      <select name="destinationDistrictId" onChange={handleChange} required>
        <option value="">Destination</option>
        {districts.map(d => (
          <option key={d.districtId} value={d.districtId}>
            {d.districtName}
          </option>
        ))}
      </select>

      <button type="submit">Save</button>
      <button type="button" onClick={() => navigate(-1)}>Cancel</button>
    </form>
  );
}
