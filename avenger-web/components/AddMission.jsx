import ReactDom from 'react-dom';
import { useState } from 'react';
import { addMission } from '../utils/mission';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
export default function AddMission(props){
  const { handleCloseAddMission } = props
  const [name, setName] = useState("");
  const [needed, setNeeded] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");

  async function handleAddMission(){
    const newMisson = {
      name: name, 
      needed: needed, 
      type: "Critical",
      icon: "../src/assets/critical.png",
      description: description, 
      color: "red",
      time: time,
      location: location,
    }
    await addMission(newMisson);

     await addDoc(collection(db, "updates"), {
      type: "Mission Created", 
      detail: `${name} mission has been created`,
      createdAt: Date.now(),
      inside: serverTimestamp(),
    });
  }

  return ReactDom.createPortal(
  <div className='modal-container'>
    <button onClick={handleCloseAddMission} className='modal-underlay' />
    <div className='modal-content'> 
      <div className='modal-header'>
        Add Mission
      </div>
      <div className='modal-body'>
        <div className='modal-sub-body'>
        <input value={name} className='modal-input' placeholder='Mission Name' onChange={(e) => {
          setName(e.target.value);
        }} />
        <input value={needed} className='modal-input' type='number' placeholder='Avengers Needed' onChange={(e) => {
          setNeeded(e.target.value);
        }} />
        </div>
        <div className='modal-sub-body'>
          <input value={location} className='modal-input' placeholder='Location' onChange={(e) => {
            setLocation(e.target.value);
          }} />
          <input value={time} className='modal-input' placeholder='Time' onChange={(e) => {
            setTime(e.target.value);
          }} /> 
        </div>
        <div></div>
        <label style={{
          marginTop: "5px",
          textAlign: "left",
          marginLeft: "-82%"
        }}>Description:</label><br />

        <textarea value={description} style={{color: 'white', height: "14vh", padding: "4px", marginTop:"6px", width: "100%"}} className='modal-input' id="description" name="description" rows="10" cols="50" placeholder="Describe the mission..." onChange={(e) => {
          setDescription(e.target.value);
        }}></textarea>
        <div className='modal-sub-body'>
          <button className='modal-button' onClick={() => {
            handleAddMission();
            handleCloseAddMission();
          }}>Add</button> 
          <button onClick={handleCloseAddMission} className='modal-button'>Cancel</button>
        </div>

        
      </div>
    </div>
  </div>,
  document.getElementById('portal')
  )
}