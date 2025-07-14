import MissionsGlobe from "./MissionsGlobe"

export default function PostLayoutAdmin(){
  const header = (
      <>
      <button className='mail-button'>
        <i className="fa-solid fa-bars"></i>
      </button>
      <span className="header-avenger">Avengers</span>
      <div className="profile-div">
      <button className='mail-button'>
        <i className="fa-solid fa-envelope"></i>
      </button>
      <span className='profile-pic'> <i className="fa-solid fa-user"></i> </span>
      <span>Sam, W.</span>
      </div>
      </>

  )
  return(
    <>
    <div className="header-container">
    {header}
    </div>
    <div className="body-card">
    <div>
    {<MissionsGlobe />}
    </div>
    </div>
    </>
  )
}