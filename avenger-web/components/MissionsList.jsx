export default function MissionsList(props){

  const { missions, missionsRefs, missionType } = props;




  return(
    <> 
    <div className="mission-list-container">
      {missions.map((mission, missionIndex) => {
        if(missionType === "All" || missionType === mission.type){
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
          <button className="assign-button">ASSIGN</button>
          </div> 
        )}
        else{
          return(
            <>
            </>
          )
        }
      })}
    </div>
    </>
  )
}