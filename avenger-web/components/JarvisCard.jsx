export default function JarvisCard(props){
  const { setClick, setType } = props;
  return(
    <>
    <img src="../src/assets/Jarvis.png" />
    <p className="user-admin-text">How Would you like to Login, <br /> Sir?</p>
    <div className="button-container">
      <button onClick={() => {
        setClick(true);
        setType("admin");
      }} className="admin-user-button"><p>ADMIN</p></button>
      <button onClick={() => {
        setClick(true);
        setType("user");
      }} className="admin-user-button"><p>USER</p></button>
    </div>
    </>
    
  )
}