export default function PostLayoutAdmin(){
  const header = (
    <div className="header-container">
      <button className='sidebar-button'>
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
    </div>
  )
  return(
    <>
    {header}
    </>
  )
}