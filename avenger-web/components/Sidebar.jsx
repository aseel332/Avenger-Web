import React from 'react';
import './Sidebar.css';

export default function Sidebar(props) {
  const { isOpen, onClose, onSelectPage } = props;

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>✕</button>
      <button className="greeting">Hello Admin!!</button><br />
      <div className="horizontal-line"></div>

      <button onClick={()=>{
        onSelectPage('dashboard');
        onClose();
      }} className='sidebar-button'>Dashboard</button><br />
      <div className="horizontal-line"></div>

      <button
        onClick={() => {
          onSelectPage('salary');
          onClose();
        }}
        className="sidebar-button"
      >
        Salary
      </button><br />
      <div className="horizontal-line"></div>

      <button onClick={()=>{
        onSelectPage('post');
        onClose();
      }}className="sidebar-button">Posts</button><br />
      <div className="horizontal-line"></div>

      <button onClick={()=>{
        onSelectPage('avengersdata');
        onClose();
      }} className="sidebar-button">Avengers Database</button><br />
      <div className="horizontal-line"></div>

      <button className="sidebar-button">Take Attendance</button><br />
      <div className="horizontal-line"></div>

      <button className="sidebar-button">Logout</button><br />
    </div>
  );
}