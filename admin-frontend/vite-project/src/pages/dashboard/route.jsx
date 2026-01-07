import { useEffect, useState } from "react";
import {
  getAllRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  getAllDistricts,
} from "../../services/api";

export default function Route() {
  const token = localStorage.getItem("mainToken");

  const [routes, setRoutes] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [form, setForm] = useState({
    routeId: null,
    sourceDistrictId: "",
    destinationDistrictId: "",
  });

  useEffect(() => {
    fetchRoutes();
    fetchDistricts();
  }, []);

  async function fetchRoutes() {
    const res = await getAllRoutes(token);
    if (res.success) setRoutes(res.data);
  }

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
      alert("Source and Destination cannot be same");
      return;
    }

    const payload = {
      sourceDistrictId: form.sourceDistrictId,
      destinationDistrictId: form.destinationDistrictId,
    };

    if (form.routeId) {
      await updateRoute(form.routeId, payload, token);
    } else {
      await createRoute(payload, token);
    }

    resetForm();
    fetchRoutes();
  }

  function handleEdit(route) {
    setForm({
      routeId: route.routeId,
      sourceDistrictId: route.sourceDistrictId,
      destinationDistrictId: route.destinationDistrictId,
    });
  }

  async function handleDelete(routeId) {
    if (!window.confirm("Delete this route?")) return;
    await deleteRoute(routeId, token);
    fetchRoutes();
  }

  function resetForm() {
    setForm({
      routeId: null,
      sourceDistrictId: "",
      destinationDistrictId: "",
    });
  }

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentRoutes = routes.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(routes.length / itemsPerPage);

  function prevPage() {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  function nextPage() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  return (
    <div className="route">
      <h2>Route Management</h2>

      <div className="route-layout">
        <form className="route-form" onSubmit={handleSubmit}>
          <h3>{form.routeId ? "Edit Route" : "Add Route"}</h3>
          <div className="select-row">
            <select className="s1"
              name="sourceDistrictId"
              value={form.sourceDistrictId}
              onChange={handleChange}
              required
            >
              <option value="">Select Source</option>
              {districts.map((d) => (
                <option key={d.districtId} value={d.districtId}>
                  {d.districtName}
                </option>
              ))}
            </select>

            <select className="s2"
              name="destinationDistrictId"
              value={form.destinationDistrictId}
              onChange={handleChange}
              required
            >
              <option value="">Select Destination</option>
              {districts.map((d) => (
                <option key={d.districtId} value={d.districtId}>
                  {d.districtName}
                </option>
              ))}
            </select>
          </div>

          <div className="button-row">

            <button type="button" onClick={resetForm}>
              Cancel
            </button>

            <button type="submit">
              {form.routeId ? "Update Route" : "Add Route"}
            </button>
          </div>
        </form>

        <div className="table-section">
          <table className="route-table" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Source</th>
                <th>Destination</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRoutes.length === 0 ? (
                <tr>
                  <td colSpan="3">No routes found</td>
                </tr>
              ) : (
                currentRoutes.map((r) => (
                  <tr key={r.routeId}>
                    <td>{r.sourceDistrictName}</td>
                    <td>{r.destinationDistrictName}</td>
                    <td>
                      <button onClick={() => handleEdit(r)}>Edit</button>
                      <button onClick={() => handleDelete(r.routeId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {routes.length > itemsPerPage && (
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
