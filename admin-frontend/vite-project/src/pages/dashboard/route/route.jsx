import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRoutes, deleteRoute } from "../../../services/api";

export default function RoutePage() {
  const token = localStorage.getItem("mainToken");
  const navigate = useNavigate();

  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    const res = await getAllRoutes(token);
    if (res.success) setRoutes(res.data);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this route?")) return;
    await deleteRoute(id, token);
    fetchRoutes();
  }

  return (
    <div>
      <h2>Route Management</h2>

      <button onClick={() => navigate("add")}> Add Route</button>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Source</th>
            <th>Destination</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r.routeId}>
              <td>{r.sourceDistrictName}</td>
              <td>{r.destinationDistrictName}</td>
              <td>
                <button onClick={() => navigate(`edit/${r.routeId}`)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(r.routeId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
