import { Outlet, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("mainToken");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-navbar">

        <div className="nav">
          <span onClick={() => navigate("/dashboard")}>Home 🏠</span> |
          <span onClick={() => navigate("searchBus")}>Search Bus 🔎🔍</span> |
          <span onClick={() => navigate("myBooking")}>My Bookings 🧾</span> |
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="navbar-divider"></div>

      
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
