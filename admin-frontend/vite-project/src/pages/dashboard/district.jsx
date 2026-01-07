import { useEffect, useState } from "react";
import {
  getAllDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} from "../../services/api";

export default function District() {
  const token = localStorage.getItem("mainToken");
  const [districts, setDistricts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [form, setForm] = useState({
    districtId: null,
    districtName: "",
  });

  useEffect(() => {
    fetchDistricts();
  }, []);

  async function fetchDistricts() {
    const res = await getAllDistricts(token);
    if (res.success) {
      setDistricts(res.data);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.districtId) {
      await updateDistrict(form.districtId, { districtName: form.districtName }, token);
    } else {
      await createDistrict({ districtName: form.districtName }, token);
    }

    resetForm();
    fetchDistricts();
  }

  function handleEdit(district) {
    setForm({
      districtId: district.districtId,
      districtName: district.districtName,
    });
  }

  async function handleDelete(districtId) {
    if (!window.confirm("Are you sure you want to delete this district?")) return;
    await deleteDistrict(districtId, token);
    fetchDistricts();
  }

  function resetForm() {
    setForm({
      districtId: null,
      districtName: "",
    });
  }

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentDistricts = districts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(districts.length / itemsPerPage);

  function prevPage() {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  function nextPage() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  return (
    <div className="district">
      <h2>District Management</h2>
      <div className="district-layout">
        <form className="district-form" onSubmit={handleSubmit}>
          <h3>{form.districtId ? "Edit District" : "Add District"}</h3>

          <input
            type="text"
            name="districtName"
            placeholder="District Name"
            value={form.districtName}
            onChange={handleChange}
            required
          />

          <div className="button-row">

            <button type="button" onClick={resetForm}>
              Cancel
            </button>

            <button type="submit">
              {form.districtId ? "Update District" : "Add District"}
            </button>
          </div>
        </form>

        <div className="table-section">
          <table className="district-table" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>District Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentDistricts.length === 0 ? (
                <tr>
                  <td colSpan="2">No districts found</td>
                </tr>
              ) : (
                currentDistricts.map((district) => (
                  <tr key={district.districtId}>
                    <td>{district.districtName}</td>
                    <td>
                      <button onClick={() => handleEdit(district)}>Edit</button>
                      <button onClick={() => handleDelete(district.districtId)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {districts.length > itemsPerPage && (
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
