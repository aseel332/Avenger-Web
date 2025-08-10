import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { ca } from "date-fns/locale";
import LiveTimer from "./LiveTimer.jsx"
import { useState } from "react";
export default function MissionsList(props){

  const { missions, missionsRefs, missionType, setShowAssignModal, detailModal, setDetailModal, setRefresh, refresh } = props;

  const type = JSON.parse(localStorage.getItem("login"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  
  async function handleDoneMission(id){
    const callRef = doc(db, "missions", id);
    const snap = await getDoc(callRef);
    if (Math.random() < 0.8) {
      await updateDoc(callRef, {
        type: "Completed",
        color: "green",
        icon: "/green-tick.png"
      })

      await addDoc(collection(db, "updates"), {
      type: "Mission Finished", 
      detail: `${snap.data().name} mission was sucessfull`,
      createdAt: Date.now(),
      inside: serverTimestamp(),
    });
    } else {
      await updateDoc(callRef, {
        type: "Failed",
        color: "white",
        icon: "/skull.png"
      });

      await addDoc(collection(db, "updates"), {
      type: "Mission Finished", 
      detail: `${snap.data().name} mission was failed`,
      createdAt: Date.now(),
      inside: serverTimestamp(),
    });
    }
  }

  async function handleAccept(index){
    
    console.log(missions);
    const callRef = doc(db, "missions", missions[index].id);
    const userCallRef = doc(db, "users", auth.currentUser.uid);
    const snap = await getDoc(callRef);
    const userSnap = await getDoc(userCallRef);
    const user = userSnap.data()
    const newAvengers = snap.data().selectedAvengers;
    let allAccepted = true;
    let updateMissionBalance = 0;
    let updateSalaryBalance = 0;
    const updatedAvengers = newAvengers.map(avenger => {

      if (avenger.name === user.name) {
  if (avenger.missionPayment && avenger.payment !== 0) {
    const payment = Number(avenger.missionPayment);
    const salaryBal = Number(user.salaryBalance);
    const missionBal = Number(user.missionBalance);
    console.log(payment, "Payment");
    console.log(salaryBal, "Salary");
    console.log(missionBal, "Mission");
    if (salaryBal < 0) {
      const total = payment + salaryBal; 

      if (total < 0) {
        updateMissionBalance = 0;
        updateSalaryBalance = total; 
      } else {
        updateMissionBalance = total;
        updateSalaryBalance = 0;
      }
    } else {
      updateMissionBalance = missionBal + payment;
      updateSalaryBalance = salaryBal;
    }
  } else{
    updateMissionBalance = user.missionBalance;
    updateSalaryBalance = user.salaryBalance;
  }

  return { ...avenger, status: true };
}


      if(!avenger.status){
        allAccepted = false;
      }

      return avenger;
    });

    

    if(allAccepted){
      await updateDoc(callRef, {
        selectedAvengers: updatedAvengers,
        type: "In-progress",
        color: "yellow",
        icon: "/in-progress.png",
        expiresAt: Date.now() + 1 * 60 * 1000,
        
      });

      await updateDoc(userCallRef, {
        missionBalance: updateMissionBalance,
        salaryBalance: updateSalaryBalance,
      });
    } else{
      await updateDoc(callRef, {
      selectedAvengers: updatedAvengers,
    });
    await updateDoc(userCallRef, {
        missionBalance: updateMissionBalance,
        salaryBalance: updateSalaryBalance,
      });
    } 

     await addDoc(collection(db, "updates"), {
      type: "Mission Accepted", 
      detail: `${user.name} has accepted mission ${snap.data().name}`,
      createdAt: Date.now(),
      inside: serverTimestamp(),
    });

    setRefresh(!refresh);
  }
  
  return(
    <> 
    <div className="mission-list-container">
      {missions.map((mission, missionIndex) => {
        if((missionType === "All" && (type === "admin" || mission.type !== "Critical")) || missionType === mission.type){
          if(type === "user" && Array.isArray(mission.selectedAvengers) &&
             !mission.selectedAvengers.some(avengerObj => avengerObj.name === admin.name)){
            return("")
           }
        return(
          <div ref={missionsRefs.current[missionIndex]} key={missionIndex} className="mission-card">
            <div className="mission-card-body">
              <img className="mission-img" src={mission.icon} /> 
              <div className="mission-info">
                <p className="mission-card-name">{mission.name} <span className="needed-info">Avengers Needed: <span className="needed-num">{mission.needed}</span></span></p>
                <div className="mission-sub-info">
                  <div className="loc-time-container">
                    Location : <span className="loc-time">{mission.location} </span>
                    <br />
                    Time: <span className="loc-time">{mission.time}</span>
                  </div>
                  <div className="mission-description">
                    {mission.description}
                  </div>
                </div>  
              </div>
            </div> 
            {mission.type !== "Critical" && <button onClick={() => {
              
              setDetailModal(missionIndex);
            }} className="assign-button">Details</button>}
          <button className={"assign-button " + (type === "admin" ? (mission.type === "Critical"? "" : "inactive-button") : mission.type === "Pending"? "" : "inactive-button")  } onClick={async () => {
            if(mission.type == "Critical"){
              setShowAssignModal(missionIndex);
            }
            if(type === "user"){
              handleAccept(missionIndex);
            }
          }} >{type === "admin"? (mission.type === "Critical"? "ASSIGN" : mission.type === "In-progress" ? <LiveTimer refresh={refresh} setRefresh={setRefresh} handleDoneMission={handleDoneMission} id={mission.id} expiresAt={mission.expiresAt} type={mission.type}/> :  "ASSIGNED"): (mission.type === "Pending"? "Accept" : mission.type === "In-progress" ? <LiveTimer refresh={refresh} setRefresh={setRefresh} handleDoneMission={handleDoneMission} id={mission.id} expiresAt={mission.expiresAt} type={mission.type}/>  : "Accepted")}</button>
          </div> 
        )}
        else{
          return(
            
            "")
        }
      })}
    </div>
    </>
  )
}