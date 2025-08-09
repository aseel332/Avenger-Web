import React, { useRef, useEffect, useState } from "react";
import { generateMissionsWithPositions } from '../utils/mission.js';
import MissionsList from "./MissionsList.jsx";
import AddMission from "./AddMission.jsx";
import AssignModal from "./AssignModal.jsx";
import Updates from "./Updates.jsx";


export default function MissionsGlobe(props){
  const { avengers } = props;
  const type = JSON.parse(localStorage.getItem("login"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  const containerRef = useRef(null);
  const [missions, setMissions] = useState([]);
  const missionsRefs = useRef([]);
  const [missionType, setMissionType] = useState("All");
  const [addMissionModal, setAddMissionModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(-1);
  const [detailModal, setDetailModal] = useState(-1);
  const [refresh, setRefresh] = useState(false);

  function handleCloseAddMission(){
    setAddMissionModal(false);
  }

  function handleCloseAssignModal(){
    setShowAssignModal(-1);
    setDetailModal(-1);
  }


  const typeList = [{name: "All", color: "white", img: null}, { name: "Critical", color: "red", img:"../src/assets/critical.png"}, { name: "Pending", color: "red", img:"../src/assets/hourglass.png"}, {name: "In-progress", color: "yellow", img:"../src/assets/in-progress.png"}, {name: "Completed", color:"green", img:"../src/assets/green-tick.png"}, {name: "Failed", color:"white", img:"../src/assets/skull.png"}];

  missionsRefs.current = missions.map((mission, missionIndex) => missionsRefs.current[missionIndex] ?? React.createRef());

  const scrollToSection = (index) => {
    setMissionType("All");
    const node = missionsRefs.current[index].current;
    node.scrollIntoView({behavior: "smooth", block: "center"});
    node.classList.add("highlight");
    setTimeout(() => {
      node.classList.remove("highlight");
    }, 1000);
  };

  useEffect(() => {
   async function loadMissions() {
      if (containerRef.current) {
        const missionsData = await generateMissionsWithPositions(containerRef.current);
        setMissions(missionsData);
        localStorage.setItem("missions", JSON.stringify(missionsData));
        
      }
    }
    loadMissions();
    
    
  }, [addMissionModal,  showAssignModal, refresh ]);

  function Missions(props){
    const { mission } = props;
    return(
      <>
        <img src={mission.icon} className='mission-popup-icon'/>
        <div>
          <p className='mission-name'>{mission.name}</p>
        </div>
      </>
    )
  }

  const header = (<header className="title-container">
    <p className="red-title">Missions {type === "admin" && <button onClick={() => {
      setAddMissionModal(true);
    }} className="add-button">Add Mission</button>}</p> 
    <hr className="red-line" />
  </header>);

  return(
    <>
    {addMissionModal && <AddMission  handleCloseAddMission={handleCloseAddMission}/>}
    {header}
    {((showAssignModal !== -1) || (detailModal !== -1)) && <AssignModal avengers={avengers} showAssignModal={showAssignModal} handleCloseAssignModal={handleCloseAssignModal} missions={missions} detailModal={detailModal} setDetailModal={setDetailModal} />}
    
    <div className="mission-body">
      <div className="mission-flex">
      <div className="globe-container" ref={containerRef}>
        {missions.map((mission, missionIndex) => {
         
          if(type === "user"){
           if(mission.type === "Critical"){
              return("");
           }
           if(Array.isArray(mission.selectedAvengers) &&
             !mission.selectedAvengers.some(avengerObj => avengerObj.name === admin.name)){
            return("")
           }
          }
          return(
            <div onClick={() => scrollToSection(missionIndex)} className="mission-popup" key={missionIndex} style={{
              left: `${mission.position.x}px`,
              top: `${mission.position.y}px`,
              color: `${mission.color}`
            }}>
              <Missions mission={mission} />
              <div className="mission-hover">
                <span style={{fontSize: "15px", 
                  fontWeight: "bold",
                  marginBottom: "6px"
                }} >{mission.name} &nbsp; - &nbsp; <span>{mission.type}</span></span>
                <br />
                <span style={{
                  fontSize: "13px"
                }}>{mission.description}</span>
              </div>
            </div>
          ) 
        })}
      </div>
      <Updates />
      </div>
      <div className="mission-list">
        <div className="mission-button-container">
      {typeList.map((inType, typeIndex)=>{
        if(type === "user"){
          if(inType.name === "Critical"){
            return("");
          }
        }
        return(
          <button onClick={() => {
            setMissionType(inType.name);
          }} style={{color: `${inType.color}`}} className={"type-button " + (missionType === inType.name? "active-type" : "")} key={typeIndex}>{inType.img? <img className="type-image" src={inType.img} /> : ""}{inType.name}</button>
        )
      })}
    </div>
        <MissionsList refresh={refresh} setRefresh={setRefresh} detailModal={detailModal} setDetailModal={setDetailModal} setShowAssignModal={setShowAssignModal} showAssignModal={showAssignModal} missions={missions} missionsRefs={missionsRefs} missionType={missionType}/>
      </div>
    </div>
    </>
  )
}
