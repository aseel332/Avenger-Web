// utils/dateUtils.js
export const formatDate = (timestamp) => {
  const date = timestamp.toDate();
  return date.toLocaleDateString("en-GB"); // e.g., "12/12/2025"
};

export const formatTime = (timestamp) => {
  const date = timestamp.toDate();
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }); // e.g., "14:00"
};

export const isExpired = (expiresAt) => {
  return Date.now() >= expiresAt;
};
