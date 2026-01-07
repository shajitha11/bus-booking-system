import { Outlet, useNavigate } from "react-router-dom";
function AdminHome() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("mainToken");
        navigate("/login", { replace: true });
    };

    return (
        <div className="dashboard">
            <div className="dashboard-navbar">
                <div className="nav-left">
                    <h2>Welcome Admin!</h2>
                </div>
                <div className="nav-right">
                    <span onClick={() => navigate("/dashboard")}>🏠 Home</span> |{" "}
                    <span onClick={() => navigate("/dashboard/district")}>🗺️ District</span> |{" "}
                    <span onClick={() => navigate("/dashboard/route")}>🚏 Route</span> |{" "}
                    <span onClick={() => navigate("/dashboard/bus")}>🚌 Bus</span> |{" "}
                    <span onClick={() => navigate("/dashboard/booking")}>📖 Booking</span> |{" "}
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <hr />
            <div className="dashboard-content">
                <Outlet />
            </div>
        </div>
    );
}
export default AdminHome;
