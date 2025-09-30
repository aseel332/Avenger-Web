
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

export function runIfPastOrToday(dateStr, callback) {

  const [day, month, year] = dateStr.split('/').map(Number);
  const fullYear = year < 100 ? 2000 + year : year;
  const inputDate = new Date(fullYear, month - 1, day);

  
  const today = new Date();
  today.setHours(0, 0, 0, 0);


  const formattedToday = String(today.getDate()).padStart(2, '0') + '/' +
                         String(today.getMonth() + 1).padStart(2, '0') + '/' +
                         String(today.getFullYear()).toString().slice(-2);


  const nextMonthDate = new Date(today);
  nextMonthDate.setMonth(today.getMonth() + 1);

  const formattedNextMonthDate = String(nextMonthDate.getDate()).padStart(2, '0') + '/' +
                                 String(nextMonthDate.getMonth() + 1).padStart(2, '0') + '/' +
                                 String(nextMonthDate.getFullYear()).toString().slice(-2);




  if (inputDate <= today) {
    callback(formattedToday, formattedNextMonthDate);
  }


 
}

export function extractDate(isoString) {
  const date = new Date(isoString);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
}

export function extractTime(isoString) {
  const date = new Date(isoString);
  return date.toTimeString().split(":").slice(0, 2).join(":"); // Returns HH:MM
}


export function formatDateDDMMYY(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0'); // ensures 2-digit day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
  const year = String(date.getFullYear()).slice(-2); // last 2 digits of year
  return `${day}/${month}/${year}`;
}

export function getFormattedDateFromCustomString(str) {
  const date = parseCustomTimestamp(str);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function getFormattedTimeFromCustomString(str) {
  const date = parseCustomTimestamp(str);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}


function parseCustomTimestamp(str) {

  const cleaned = str.replace(/ at /, ', ').replace(/ UTC.*$/, '');
  const date = new Date(cleaned);
  if (isNaN(date)) {
    throw new Error("Invalid date format: " + str);
  }
  return date;
}

export function formatDMY(timestamp) {
  if (!timestamp) return "";

  let dateObj;
  if (typeof timestamp.toDate === "function") {
    dateObj = timestamp.toDate();
  } else if (typeof timestamp._seconds === "number") {
    dateObj = new Date(timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1000000));
  } else {
    return "";
  }

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = String(dateObj.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

export function formatHM(timestamp) {
  if (!timestamp) return "";

  let dateObj;
  if (typeof timestamp.toDate === "function") {
    dateObj = timestamp.toDate();
  } else if (typeof timestamp._seconds === "number") {
    dateObj = new Date(timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1000000));
  } else {
    return "";
  }

  const hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}



