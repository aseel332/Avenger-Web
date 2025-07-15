import ReactDom from 'react-dom';
import { useState, useEffect } from 'react';
import { addMission } from '../utils/mission';
import { avengers } from '../utils/avengers';
export default function AssignModal(props){
  

  const { showAssignModal, handleCloseAssignModal, missions } = props;
  const [selectedAvengers, setSelectedAvengers] = useState([]);
  
  
  const mid = Math.ceil(selectedAvengers.length / 2);
  const topRowItems = selectedAvengers.slice(0, mid);
  const bottomRowItems = selectedAvengers.slice(mid);
  console.log(topRowItems);
  
  function MissionPaymentCard(props){
    const {avenger} = props;
    return(
      <>
      <img className='avenger-faceshot' src={avenger.img} />
      <div>
        <span>{avenger.name}</span> <br/>
        <input className='mission-payment-input' type='number'placeholder='$0' />
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
      <div className='modal-body'>
       
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
             return [...prevAvengers, avenger];
            }
});
            }} key={avengerIndex} className='avenger-container'>
              <img className={'avenger-faceshot ' + (selectedAvengers.find(a => a.name === avenger.name )? "active-faceshot" : "")} src={avenger.img} />
            </div>
            )
          })}
         </div>
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
              <MissionPaymentCard avenger={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
     <div className='modal-sub-body'>
          <button className='modal-button'>Assign</button> 
          <button onClick={handleCloseAssignModal} className='modal-button'>Cancel</button>
        </div>
      </div>
    
    </div>
  </div>,
  document.getElementById('portal')
  )
}