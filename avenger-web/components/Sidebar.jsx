import React from 'react';
import './Sidebar.css';

export default function Sidebar(props) {
  const { isOpen, onClose, onSelectPage } = props;

  function setPage(page){
    onSelectPage(page);
    localStorage.setItem("page", JSON.stringify(page));
    onClose();
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>✕</button>
      <button className="greeting">Hello Admin!!</button><br />
      <div className="horizontal-line"></div>

      <button onClick={()=>{
        setPage("dashboard");
        
      }} className='sidebar-button'>Dashboard</button><br />
      <div className="horizontal-line"></div>

      <button
        onClick={() => {
          setPage("salary");
        }}
        className="sidebar-button"
      >
        Salary
      </button><br />
      <div className="horizontal-line"></div>

      <button onClick={()=>{
        setPage("post");
      }}className="sidebar-button">Posts</button><br />
      <div className="horizontal-line"></div>

      <button onClick={()=>{
        setPage("avengersdata");
      }} className="sidebar-button">Avengers Database</button><br />
      <div className="horizontal-line"></div>

      <button onClick={()=>{
        setPage("takeAttendance");
      }} className="sidebar-button">Take Attendance</button><br />
      <div className="horizontal-line"></div>

      <button className="sidebar-button">Logout</button><br />
    </div>
  );
}