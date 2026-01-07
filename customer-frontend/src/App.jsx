import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/login";
import Otp from "./pages/verifyOtp";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetpassword";

import Dashboard from "./pages/dashboard";
import SearchBus from "./pages/searchBus";
import MyBookings from "./pages/mybooking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verifyOtp" element={<Otp />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="searchBus" element={<SearchBus />} />
          <Route path="myBooking" element={<MyBookings />} />
        </Route>

        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
