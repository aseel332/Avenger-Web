export default function MissionsList(props){

  const { missions } = props;

  const typeList = [{name: "All", color: "white", img: null}, { name: "Danger", color: "red", img:"../src/assets/critical.png"}, {name: "In Progress", color: "yellow", img:"../src/assets/in-progress.png"}, {name: "Completed", color:"green", img:"../src/assets/green-tick.png"}, {name: "Failed", color:"white", img:"../src/assets/skull.png"}];


  return(
    <> 
      <div className="mission-button-container">
      {typeList.map((type, typeIndex)=>{
        return(
          <button style={{color: `${type.color}`}} className="type-button" key={typeIndex}>{type.img? <img className="type-image" src={type.img} /> : ""}{type.name}</button>
        )
      })}
    </div>
    <div className="mission-list-container">
      {missions.map((mission, missionIndex) => {
        return(
          <div key={missionIndex} className="mission-card">
            <div className="mission-card-body">
              <img className="mission-img" src={mission.icon} /> 
              <div className="mission-info">
                <p className="mission-card-name">{mission.name} <span className="needed-info">Avengers Needed: <span className="needed-num">{mission.needed}</span></span></p>
                <div className="mission-sub-info">
                  <div className="loc-time-container">
                    Location : <span className="loc-time">Missouri </span>
                    <br />
                    Time: <span className="loc-time">Day </span>
                  </div>
                  <div className="mission-description">
                    {mission.description}
                  </div>
                </div>  
              </div>
            </div>
          <button className="assign-button">ASSIGN</button>
          </div> 
        )
      })}
    </div>
    </>
  )
}