import ReactDom from 'react-dom';
import { useState, useEffect } from 'react';
import { addMission, deleteMission } from '../utils/mission';

export default function AssignModal(props){
  
 
  const { avengers, showAssignModal, handleCloseAssignModal, missions } = props;
  const [selectedAvengers, setSelectedAvengers] = useState([]);
  
  
  
  const mid = Math.ceil(selectedAvengers.length / 2);
  const topRowItems = selectedAvengers.slice(0, mid);
  const bottomRowItems = selectedAvengers.slice(mid);
  
  function handleAssign(){
    
    missions[showAssignModal].selectedAvengers = selectedAvengers;
    deleteMission(missions[showAssignModal].id);
    // //delete missions[showAssignModal].position;
    missions[showAssignModal].type = "Pending";
    missions[showAssignModal].icon = "../src/assets/hourglass.png"
    // missions[showAssignModal].color = "yellow";
    missions[showAssignModal].outcome = Math.random() <= 0.75? "Sucessful" : "Failed";
    delete missions[showAssignModal].id;
    addMission(missions[showAssignModal]);
    handleCloseAssignModal();
    console.log(missions[showAssignModal].outcome);
  }

  function avengersLeft(mission){
    return mission.needed - selectedAvengers.length;
  }

  
  
  function MissionPaymentCard(props){
    const {avenger} = props;
    const [payment, setPayment] = useState('');


   
    
    return(
      <>
      <img className='avenger-faceshot' src={avenger.img} />
      <div>
        <span>{avenger.name}</span> <br/>
        <input value={payment} className='mission-payment-input' type='number'placeholder='$0' onChange={ (e) => {
          const newValue = e.target.value
          setPayment(newValue);
          avenger.missionPayment = newValue; 
          
        }} />
      </div>
      </>
    )
  }



  return ReactDom.createPortal(
  <div className='modal-container'>
    <button onClick={handleCloseAssignModal} className='modal-underlay' />
    <div className='modal-content'> 
     <div className='modal-header'>
        {missions[showAssignModal].name + " - Avengers Selction"}
      </div>
      <div className='modal-body-assign'>
       <span style={{fontSize: "1.5vw", fontWeight: "bold", fontStyle: "italic"}}>Select Avengers</span><span className="needed-info">Avengers Needed: <span className="needed-num">{avengersLeft(missions[showAssignModal])}</span></span>
         <div className='modal-sub-body-assign'>
          
          {avengers.map((avenger, avengerIndex) => {
            return(
            <div onClick={() => {
            
             setSelectedAvengers(prevAvengers => {
             const exists = prevAvengers.find(a => a.name === avenger.name); // or whatever unique key you have
              
             if (exists) {
             // remove it
              return prevAvengers.filter(a => a.name !== avenger.name);
             } else {
             // add it
             if(avengersLeft(missions[showAssignModal]) === 0){
             return prevAvengers;
             } else{
              return [...prevAvengers, avenger]
             }

             }
          });

              

            }} key={avengerIndex} className='avenger-container'>
              <img className={'avenger-faceshot ' + (selectedAvengers.find(a => a.name === avenger.name )? "active-faceshot" : "")} src={avenger.img} />
            </div>
            )
          })}
         </div>
         <span style={{fontSize: "1.5vw", fontWeight: "bold", fontStyle: "italic",}}>Mission Payment</span>
         <div className="outer-container">
          
      <div className="columns-container">
        <div className="column">
          {topRowItems.map((item, idx) => (
            <div key={idx} className="cell">
              <MissionPaymentCard avenger={item} /> 
            </div>
          ))}
        </div>
        <div className="column">
          {bottomRowItems.map((item, idx) => (
            <div key={idx} className="cell">
              <MissionPaymentCard  avenger={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
     <div className='modal-sub-body'>
          <button onClick={() =>{
            
            handleAssign();
            
          }} className='modal-button'>Assign</button> 
          <button onClick={handleCloseAssignModal} className='modal-button'>Cancel</button>
        </div>
      </div>
    
    </div>
  </div>,
  document.getElementById('portal')
  )
}