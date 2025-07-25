import "../src/TakeAttendance.css"
import { arrayToList, fetchAttendanceCalls, } from "../utils/attendance";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { formatDate, formatTime, isExpired } from "../utils/dateUtils";
import LiveTimer from "./LiveTimer";
import AttendanceChart from "./AttendanceChart";
import dayjs from "dayjs";


export default function TakeAttendance(props){
  const { avengers } = props;
  const [attendanceCard, setAttendanceCard] = useState(-1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [calls, setCalls] = useState([]);
  const [currentCall, setCurrentCall] = useState({});
  const [showChart, setShowChart] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekRange = (offset = 0) => {
      const start = dayjs().startOf("week").add(offset, "week");
      const end = start.endOf("week");
      return { start, end };
    };
  
    const { start, end } = getWeekRange(weekOffset);
  
    const filteredData = calls
      .filter(call =>
        dayjs(call.expiresAt).isAfter(start) &&
        dayjs(call.expiresAt).isBefore(end)
      )

  const registerAttendance = async ()=>{
    const adminId = auth.currentUser.uid;
    const callId = Date.now().toString();
    const otps = {};

    avengers.forEach(avenger => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otps[avenger.id] = otp;
    });

    const callRef = doc(db, "attendanceCalls", callId);
    const expiresAt = Date.now() + 60_000;
    await setDoc(callRef, {
      adminId, 
      name,
      description,
      createdAt: serverTimestamp(),
      expiresAt,
      otps,
      responses: {}
    });
    setCurrentCall({callId, expiresAt});
    setName("");
    setDescription("");
    return {callId, expiresAt};
  }
  

    const header = (<header className="title-container">
      <p className="red-title">Attendance<button onClick={() => {
      setShowChart(!showChart);
    }} className="add-button">{showChart? "List" : "Chart"}</button></p> 
    <hr className="red-line" /> 
    </header>);

    useEffect(() => {
      const getCalls = async () => {
        const data = await fetchAttendanceCalls();
        setCalls(data);
      };
      getCalls();
    }, [currentCall]);

  const now = Date.now();

    function Attendance(props){
      const { attendance, attendanceIndex } = props
      const [inactive, setInactive] = useState(isExpired(attendance.expiresAt));
      let absents = [];

      function absentList(){
        
        for(const userId of Object.keys(attendance.responses)){
          if(attendance.responses[userId] === false){
            const matched = avengers.find(avenger => avenger.id === userId);        
            absents.push(matched.name);
          }
        }
        
      }
      absentList();
     
      return(
        <>
         <div className="header-card">
          <div className="attendance-name">{attendance.name}</div>
          <div className="attendance-sub-head">Date: <span className="value-info">{formatDate(attendance.createdAt)}</span></div>
          <div className="attendance-sub-head">Time: <span className="value-info">{formatTime(attendance.createdAt)}</span></div>
         </div>
         <div className="header-card">
          <div className="attendance-sub-head" style={{width: "50%", color:"white"}}>{attendance.description} </div>
          <div className="attendance-sub-head" >Created By: <span className="value-info">Sam, W</span></div>
          {inactive ? (<div className="attendance-sub-head" >Attendance: <span className="value-info">{attendance.attendancePercentage}%</span></div>) : <div className="attendance-sub-head" >Timer: <span className="value-info"><LiveTimer currentCall={currentCall} setCurrentCall={setCurrentCall} expiresAt={attendance.expiresAt} /></span></div>}
         </div>
         {inactive? ( attendanceCard === attendanceIndex ? 
          (<div className="header-card">
          <div className="attendance-sub-head" style={{width: "50%",}}>Avengers Absent: <span className="value-info">{arrayToList(absents)}</span> </div>
          <div className="attendance-sub-head" >Total: <span className="value-info">{avengers.length}</span></div>
          <div className="attendance-sub-head" >Present: <span className="value-info">{avengers.length - absents.length}</span></div>
         </div>) : ""
        ): ""}
        </>
      )
    }

  return(
    <>
    {header}
    
     <div className="body-take-attendance">
      
      {showChart?
      <div className="chart-body">
         <AttendanceChart calls={calls} />
         </div>
         :
         
         <div className="attendance-body">
          <div className="week-header">
    <button onClick={() => setWeekOffset(w => w - 1)} className="week-button">←</button>
    <h2 className="text-xl font-bold">
      Week: {start.format("DD MMM")} – {end.format("DD MMM")}
    </h2>
    <button onClick={() => setWeekOffset(w => w + 1)} className="week-button">→</button>
  </div>
  {filteredData.length === 0 ? (
    <p style={{textAlign: "center"}}>No attendance data for this week.</p>
  ) :
  (filteredData.map((attendance, attendanceIndex) => {
          return(
            <div key={attendanceIndex} onClick={() => {
            if(attendanceIndex === attendanceCard){
              setAttendanceCard(-1);
            }else{
              setAttendanceCard(attendanceIndex);
            }
          }} className="attendance-card">
            <Attendance  attendance={attendance} attendanceIndex={attendanceIndex} />
            </div>
          )
        })) 
}
        
      </div> }
      <div className="add-attendance-container">
        <div>
          <span className="add-attendance-header">Start Attendance Call</span>
        </div>
        <><div>
          <input value={name} className="add-attendance-input" placeholder="Name" onChange={(e) => {
            const newValue = e.target.value;
            setName(newValue);
          }}/>
        </div>

        <div>
          <textarea value={description} className="add-attendance-box" placeholder="Decribe The Call" onChange={(e) => {
            const newValue = e.target.value;
            setDescription(newValue);
          }}/>
        </div>
        <div>
          <button className="add-attendance-button" onClick={registerAttendance}>Start</button>
        </div> </>
        
      </div>
    </div>
    </>
  )
}