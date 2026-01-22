import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./app.css";

import Login from "./pages/auth/login.jsx";
import Otp from "./pages/auth/Otp.jsx";

import AdminProtectedRoute from "./routes/adminProtectedRoute.jsx";

import AdminHome from "./pages/dashboard/adminHome.jsx";
import Bus from "./pages/dashboard/bus/bus.jsx";
import RoutePage from "./pages/dashboard/route/route.jsx";
import District from "./pages/dashboard/district.jsx";
import Booking from "./pages/dashboard/booking.jsx";

import AddRoute from "./pages/dashboard/route/addRoute.jsx";
import EditRoute from "./pages/dashboard/route/editRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />


        <Route element={<AdminProtectedRoute />}>
          <Route path="/dashboard" element={<AdminHome />}>
            <Route path="district" element={<District />} />
            <Route path="route">
              <Route index element={<RoutePage />} />
              <Route path="add" element={<AddRoute />} />
              <Route path="edit/:id" element={<EditRoute />} />
            </Route>
            <Route path="bus" element={<Bus />} />
            <Route path="booking" element={<Booking />} />
          </Route>
        </Route>

        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
