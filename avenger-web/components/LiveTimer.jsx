import { useEffect, useState } from "react";
import { finalizeAttendanceCall } from "../utils/attendance";

export default function LiveTimer({ expiresAt, currentCall, setCurrentCall, type, handleDoneMission, id, setRefresh, refresh }) {
  const [timeLeft, setTimeLeft] = useState("01:00");
  
  useEffect(() => {
    
    const interval = setInterval(() => {
      const msLeft = expiresAt - Date.now();
      if (msLeft <= 0) {
        setTimeLeft("00:00");
        clearInterval(interval);
        if(type === "In-progress"){
          handleDoneMission(id);
          setRefresh(!refresh);
          return;
        } else if(type === "attendance"){
          return;
        }
        else{
        finalizeAttendanceCall(currentCall.callId);
        setCurrentCall({});
        }
        return;
      }

      const minutes = Math.floor(msLeft / 60000);
      const seconds = Math.floor((msLeft % 60000) / 1000);
      const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      setTimeLeft(formatted);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);


    
  

  return <> {timeLeft} </>;
}
