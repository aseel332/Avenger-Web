const BASE_URL = "http://localhost:3000"; // Change this if backend is deployed

async function apiRequest(endpoint, method = "GET", body = null) {
  const config = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }
  return response.json();
}

/** Create a new user account */
export async function createAccount(userId, name, email, initialBalance = 0) {
  return apiRequest("/create-account", "POST", { userId, name, email, initialBalance });
}

/** Step 1: Request OTP for a payment */
export async function requestOtp(fromUpi, toUpi, amount) {
  return apiRequest("/request-otp", "POST", { fromUpi, toUpi, amount });
}

/** Step 2: Verify OTP and complete payment */
export async function verifyOtp(fromUpi, otp) {
  return apiRequest("/verify-otp", "POST", { fromUpi, otp });
}

/** Get balance of a user by UPI */
export async function getBalance(upiId) {
  return apiRequest(`/balance/${upiId}`);
}

/** Get transactions for a user by userId */
export async function getTransactions(userId) {
  return apiRequest(`/transactions/${userId}`);
}

/** Get user details by userId */
export async function getUser(userId) {
  return apiRequest(`/user/${userId}`);
}

export async function forceTransfer(toUpi, amount) {
  return apiRequest("/force-transfer", "POST", { toUpi, amount });
}

export async function getAllTransactions() {
  return apiRequest("/all-transactions");
}

export async function sendAttendanceOtps(otps) {
  return apiRequest("/send-attendance-otps", "POST", { otps });
}

export async function sendAnnouncementEmails(title, body, recipients) {
  return apiRequest("/send-announcement", "POST", { title, body, recipients });
}

