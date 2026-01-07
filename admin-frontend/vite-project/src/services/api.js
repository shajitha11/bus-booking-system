const BASE_URL = "http://localhost:5000/api";

async function request(endpoint, method = "GET", data, token) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : null,
  });

  const json = await res.json();

  if (!res.ok) {
    if(res.status===401||res.status===403){
      localStorage.removeItem("mainToken");
      alert("session expired.Please login again");
      window.location.href="/login";
      return;
    }
    throw {
      response: {
        status: res.status,
        data: json,
      },
    };
  }

  return json;
}


export const adminLogin = (data) =>
  request("/user/login", "POST", data);

export const verifyAdminOtp = (data) =>
  request("/user/verify-otp", "POST", data);

export const getAllBuses = (token) =>
  request("/bus", "GET", null, token);

export const createBus = (data, token) =>
  request("/bus/create", "POST", data, token);

export const updateBus = (id, data, token) =>
  request(`/bus/edit/${id}`, "PUT", data, token);

export const deleteBus = (id, token) =>
  request(`/bus/delete/${id}`, "DELETE", null, token);

export const getAllDistricts = (token) =>
  request("/district", "GET", null, token);

export const createDistrict = (data, token) =>
  request("/district/create", "POST", data, token);

export const updateDistrict = (id, data, token) =>
  request(`/district/edit/${id}`, "PUT", data, token);

export const deleteDistrict = (id, token) =>
  request(`/district/delete/${id}`, "DELETE", null, token);

export const getAllRoutes = (token) =>
  request("/route", "GET", null, token);

export const createRoute = (data, token) =>
  request("/route/create", "POST", data, token);

export const updateRoute = (id, data, token) =>
  request(`/route/edit/${id}`, "PUT", data, token);

export const deleteRoute = (id, token) =>
  request(`/route/delete/${id}`, "DELETE", null, token);

export const getAllBookings=(token)=>
  request("/booking","GET",null,token);

export const updateBookingStatus = (id, data, token) =>
  request(`/booking/edit/${id}/status`, "PUT", data, token);

export const deleteBooking = (id, token) =>
  request(`/booking/delete/${id}`, "DELETE", null, token);
