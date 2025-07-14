import React, { useRef, useEffect, useState } from "react";
import { generateMissionsWithPositions } from '../utils/mission.js';
import MissionsList from "./MissionsList.jsx";

export default function MissionsGlobe(){

  const containerRef = useRef(null);
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    if (containerRef.current) {
      const generated = generateMissionsWithPositions(containerRef.current);
      setMissions(generated);
    }
  }, []);

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
    <p className="red-title">Missions</p>
    <hr className="red-line" />
  </header>);

  return(
    <>
    {header}
    
    <div className="mission-body">
      <div className="globe-container" ref={containerRef}>
        {missions.map((mission, missionIndex) => {
          return(
            <div className="mission-popup" key={missionIndex} style={{
              left: `${mission.position.x}px`,
              top: `${mission.position.y}px`,
              color: `${mission.color}`
            }}>
              <Missions mission={mission} />
            </div>
          ) 
        })}
      </div>
      <div className="mission-list">
        <MissionsList missions={missions}/>
      </div>
    </div>
    </>
  )
}
