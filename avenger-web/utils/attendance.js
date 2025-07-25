import { collection, doc, getDoc, getDocs, query, orderBy, updateDoc  } from "firebase/firestore";
import { auth, db } from "../firebase";

export const attendanceData = [
  
];

export function arrayToList(abesntList){
  let avengerString = "";
  for(const avenger of abesntList){
    avengerString += (avenger + ", ")
  }
  return avengerString;
}

export const fetchAttendanceCalls = async () => {
  const q = query(
    collection(db, "attendanceCalls"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};


export const finalizeAttendanceCall = async (callId) => {
  const callRef = doc(db, "attendanceCalls", callId);
  const snap = await getDoc(callRef);
  let absentCount = 0;
  

  if (!snap.exists()) return;

  const data = snap.data();


  const responses = data.responses || {};
  const otps = data.otps || {};

  const updatedResponses = { ...responses };

  for (const userId of Object.keys(otps)) {

    if (!responses[userId]) {
      updatedResponses[userId] = false;
      absentCount++;
    }
  }
  const length = Object.keys(otps).length;
  const attendancePercentage = Number((((length - absentCount) * 100)/(length)).toFixed(0));
  
  await updateDoc(callRef, {
    responses: updatedResponses,
    attendancePercentage: attendancePercentage
  });
}






