import { useState } from "react";
import Sidebar from "./Sidebar";
import MissionsGlobe from "./MissionsGlobe";
import SalaryCard from "./SalaryCard";
import Post from './Post';
import Avengers from './Avengers';
import './Sidebar.css';
import '../src/index.css'
import { getAvengers } from "../utils/avengers";
import { useEffect } from "react";
import TakeAttendance from "./TakeAttendance";
import { auth, db } from "../firebase";
import { forceTransfer, getUser } from "../src/api";
import { runIfPastOrToday } from "../utils/dateUtils";
import { doc, getDoc, updateDoc, onSnapshot, collection, getDocs  } from "firebase/firestore";
import Transactions from "./Transactions";
import Money from "./Money";
import AddAvengerModal from "./AddAvengerModal";
import AttendanceOtpModal from "./AttendanceOtpModal";
import AvengersDetail from "./Information";

export default function PostLayoutAdmin(props) {
  const { type } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(JSON.parse(localStorage.getItem("page")) || 'Missions');
  const [avengers, setAvengers] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")) || {});
  const [initial, setInitial] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [showInfo, setShowInfo ] = useState(false);
  const currentUser = auth.currentUser;


  const header = (
    <>
      {/* ✅ Only show when sidebar is CLOSED */}
      {!isSidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} className='mail-button'>
          <i className="fa-solid fa-bars"></i>
        </button>
      )}
      
      <span className="header-avenger" onClick={() => {
        setSelectedPage("dashboard");
      }}>Avengers</span>

      <div className="profile-div">
        <button className='mail-button' onClick={() => window.open("https://mail.google.com/mail/u/0/#inbox", "_blank")}>
          <i className="fa-solid fa-envelope"></i>
        </button>
        <img className="avenger-faceshot" src={ admin? admin.img : "P"}  onClick={() => {
          setShowInfo(true);
        }}/>
        <span>{admin? admin.real : "Name"}</span>
      </div>
    </>
  );

  useEffect(() => {
    if(type === "admin") return;
    if (!currentUser) return;

    const unsubscribe = onSnapshot(
      collection(db, "attendanceCalls"),
      (snapshot) => {
        const now = Date.now();
        let latestCall = null;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const expiresAt = data.expiresAt;

          if (
            data.otps &&
            data.otps[currentUser.uid] && // this user is included
            now < expiresAt &&             // not expired
            !(data.responses && data.responses[currentUser.uid]) // not responded yet
          ) {
            latestCall = { ...data, callId: doc.id };
          }
        });

        setActiveCall(latestCall); // shows popup if new active call exists
      }
    );

    return () => unsubscribe();
  }, [currentUser]);


  useEffect(() => {

    async function loadAdmin() {
      const callRef = doc(db, "admins", auth.currentUser.uid);
      const snap = await getDoc(callRef);
      if (!snap.exists()) return;
      const data = snap.data();
      
      setAdmin(data);
      localStorage.setItem("admin", JSON.stringify(data));
    }
    async function loadUser() {
      const callRef = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(callRef);
      if (!snap.exists()) return;
      const data = snap.data();
      if(!data.salary){
        setInitial(true);
      }
      setAdmin(data);
      localStorage.setItem("admin", JSON.stringify(data));
      console.log(data);
    }

    if(type === "user"){
      loadUser();
    }

    if(type === "admin"){
    loadAdmin();
    }
    
    const some = JSON.parse(localStorage.getItem("admin"))
    setAdmin(some);
    
  }, [initial])



  useEffect( () => {
    async function loadAvengers() {
      setAvengers(await getAvengers());
      localStorage.setItem("avengers", JSON.stringify(await getAvengers()));
      const querySnapShot = await getDocs(collection(db, "admins"));
      setAdminsList(querySnapShot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    }
    loadAvengers();


  }, [])

  useEffect(() => {
  async function updateSalary() {
    try {
      for (const avenger of avengers) {
        runIfPastOrToday(avenger.npd, async (formattedToday, formattedNextMonthDate) => {
          const callRef = doc(db, "users", avenger.id);
          const snap = await getDoc(callRef);
          if (!snap.exists()) return;

          avenger.lpd = formattedToday;
          avenger.npd = formattedNextMonthDate;
          avenger.salaryBalance += avenger.salary;

          await updateDoc(callRef, {
            lpd: avenger.lpd,
            npd: avenger.npd,
            salaryBalance: avenger.salaryBalance,
          });

        });
      }
      runIfPastOrToday(admin.npd, async (formattedToday, formattedNextMonthDate) => {
        console.log(admin);
        const callRef = doc(db, "admins", auth.currentUser.uid);
        const snap = await getDoc(callRef);
        if(!snap.exists()) return;
        admin.lpd = formattedToday;
        admin.npd = formattedNextMonthDate;
        await forceTransfer(admin.upiId, admin.salary);
        await updateDoc(callRef, {
          lpd: admin.lpd,
          npd: admin.npd,
        });
      })
    } catch (e) {
      console.error("Salary update failed:", e.message);
    }
  }

  if (avengers.length > 0) {
    updateSalary();
  }
}, [avengers]); // Only runs when avengers are fetched


    
  

  const currPage = () => {
    if (selectedPage === 'salary') {
      return <SalaryCard  admin={admin} avengers={avengers} />;
    }
    if (selectedPage === 'dashboard') {
      return <MissionsGlobe avengers={avengers} />;
    }
    if (selectedPage === 'post') {
      return <Post />;
    }
    if (selectedPage === 'avengersdata') {
      return <Avengers avengers={avengers} />;
    }
    if(selectedPage=== "takeAttendance"){
      return <TakeAttendance avengers={avengers} />
    }
    if(selectedPage === "transactions"){
      return <Transactions avengers={avengers} />
    }
    if(selectedPage === "money"){
      return <Money adminsList={adminsList} avengers={avengers} />
    }
    return <MissionsGlobe type={type} avengers={avengers} />;
  };



  return (
    <>
      {showInfo && <AvengersDetail onClose={() => {
        setShowInfo(false);
      }} />}
      {activeCall && <AttendanceOtpModal call={activeCall} onClose={() => setActiveCall(null)} />} 
      {initial && <AddAvengerModal setInitial={setInitial} />}
      <div className="header-container">{header}</div>
      <div className="body-card">{currPage()}</div>

      {/* ✅ Sidebar controls the same state */}
      <Sidebar
        type={type}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectPage={(page) => setSelectedPage(page)}
        
      />
    </>
  );
}