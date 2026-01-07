import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/auth/Login";
import Otp from "./pages/auth/Otp";

import AdminProtectedRoute from "./routes/AdminProtectedRoute";

import AdminHome from "./pages/dashboard/AdminHome";
import Bus from "./pages/dashboard/Bus";
import RoutePage from "./pages/dashboard/Route";
import District from "./pages/dashboard/District";
import Booking from "./pages/dashboard/Booking";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />


        <Route element={<AdminProtectedRoute />}>
          <Route path="/dashboard" element={<AdminHome />}>
            <Route path="district" element={<District />} />
            <Route path="route" element={<RoutePage />} />
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
