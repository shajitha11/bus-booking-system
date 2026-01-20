import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/auth/login";
import Otp from "./pages/auth/otp";

import AdminProtectedRoute from "./routes/adminProtectedRoute";

import AdminHome from "./pages/dashboard/adminHome";
import Bus from "./pages/dashboard/bus/bus";
import RoutePage from "./pages/dashboard/route/route";
import District from "./pages/dashboard/district";
import Booking from "./pages/dashboard/booking";

import AddRoute from "./pages/dashboard/route/addRoute";
import EditRoute from "./pages/dashboard/route/editRoute";

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
