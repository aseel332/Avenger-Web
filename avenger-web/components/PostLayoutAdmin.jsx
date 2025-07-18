import { useState } from "react";
import Sidebar from "./Sidebar";
import MissionsGlobe from "./MissionsGlobe";
import SalaryCard from "./SalaryCard";
import Post from './posts';
import Avengers from './Avengers';
import './Sidebar.css';
import { getAvengers } from "../utils/avengers";
import { useEffect } from "react";

export default function PostLayoutAdmin() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState('Missions');
  const [avengers, setAvengers] = useState([]);



  const header = (
    <>
      {/* ✅ Only show when sidebar is CLOSED */}
      {!isSidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} className='mail-button'>
          <i className="fa-solid fa-bars"></i>
        </button>
      )}
      
      <span className="header-avenger">Avengers</span>

      <div className="profile-div">
        <button className='mail-button'>
          <i className="fa-solid fa-envelope"></i>
        </button>
        <span className='profile-pic'>
          <i className="fa-solid fa-user"></i>
        </span>
        <span>Sam, W.</span>
      </div>
    </>
  );

  useEffect(() => {
    async function loadAvengers() {
      setAvengers(await getAvengers());
    }
    loadAvengers();
    
  }, [])
  

  const currPage = () => {
    if (selectedPage === 'salary') {
      return <SalaryCard avengers={avengers} />;
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
    return <MissionsGlobe avengers={avengers} />;
  };



  return (
    <>
      <div className="header-container">{header}</div>
      <div className="body-card">{currPage()}</div>

      {/* ✅ Sidebar controls the same state */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectPage={(page) => setSelectedPage(page)}
      />
    </>
  );
}