import React from 'react';
import './Sidebar.css';
import { useAuth } from '../src/context/AuthContext';

export default function Sidebar(props) {
  const { isOpen, onClose, onSelectPage, type } = props;
  const { userLogout } = useAuth();

  function setPage(page){
    onSelectPage(page);
    localStorage.setItem("page", JSON.stringify(page));
    onClose();
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>✕</button>
      <button className="greeting">{type === "admin" ? "Hello Admin" : "Hello User"}</button><br />
      <div className="horizontal-line"></div>

      <button onClick={()=>{
        setPage("dashboard");
        
      }} className='sidebar-button'>Dashboard</button><br />
      <div className="horizontal-line"></div>

      { type === "admin" && (<>
      <button
        onClick={() => {
          if(type === "admin"){
            setPage("salary");
          }else{
            setPage("money");
          }
        }}
        className="sidebar-button"
      >
        Salary
      </button><br />
      <div className="horizontal-line"></div>
      </>)}


      <button onClick={()=>{
        setPage("post");
      }}className="sidebar-button">Posts</button><br />
      <div className="horizontal-line"></div>

      { type === "admin" &&
      (<><button onClick={()=>{
        setPage("avengersdata");
      }} className="sidebar-button">Avengers Database</button><br />
      <div className="horizontal-line"></div>
      </>)}

      { type === "admin" && (<>
      <button onClick={()=>{
        setPage("takeAttendance");
      }} className="sidebar-button">Take Attendance</button><br />
      <div className="horizontal-line"></div>
      </>)}

      <button onClick={()=>{
         if(type === "admin"){
            setPage("transactions");
          }else{
            setPage("money");
          }
        
      }} className="sidebar-button">{type === "admin"? "Transactions" : "Money"}</button><br />
      <div className="horizontal-line"></div>

      <button onClick={() => {
        userLogout();
       
      }} className="sidebar-button">Logout</button><br />
    </div>
  );
}