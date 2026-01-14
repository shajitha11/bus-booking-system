const BASE_URL =  import.meta.env.VITE_BASE_URL || __BASE_URL__;
async function request(endpoint, method = "GET", data, token) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : null,
  });
  const json=await res.json();

  if(!res.ok){
    if(res.status===401||res.status===403){
        localStorage.removeItem("mainToken");
        alert("session expired.Please login again");
        window.location.href="/login";
        return;
    }
      const error = new Error(json.error || json.message || "Request failed");
      error.response = {
      status: res.status,
      data: json,
    };

    throw error;
    };

  return json;
}

export const customerSignup=(data)=>
    request("/user/signup","POST",data);

export const customerLogin=(data)=>
    request("/user/login","POST",data);

export const customerOtp=(data)=>
    request("/user/verify-otp","POST",data);

export const forgotPassword=(data)=>
    request("/user/forgot-password","POST",data);

export const resetPassword=(data)=>
    request("/user/reset-password","PUT",data);

export const getAllDistricts=(token)=>
    request("/district","GET",null,token);

export const getAllRoutes=(token)=>
    request("/route","GET",null,token);

export const getAllBuses=(token)=>
    request("/bus","GET",null,token);

export const getMyBookings=(token)=>
    request("/booking/my","GET",null,token);


export const createBooking = (data,token) =>
    request("/booking", "POST", data, token);

export const updateBookingStatus = (bookingId, status, token) =>
  request(`/booking/edit/${bookingId}/status`, "PUT", { bookingStatus: status }, token);

export const getBusSeatStatus = (busId, date, token) =>
  request(`/bus/${busId}/seats?date=${date}`, "GET", null, token);


