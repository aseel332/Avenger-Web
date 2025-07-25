import { useState } from "react";
import { useAuth } from "../src/context/AuthContext";

export default function Login(props){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { type, setType } = props;
  const { userSignUp, userLogout, adminLogin, userLogin } = useAuth();
  return(
    <>
    <img className="jarvis-img" src="../src/assets/jarvis_no.png" />
    <p className="login-text">{type == "signup"? "NEW AVENGER" : type + " LOGIN"}</p>
    <div className="input-container">
      <input className="email-input" placeholder="Email" value={email} onChange={(e) => {
        setEmail(e.target.value);
      }}/>
      <input className="email-input" placeholder="Password" type="password" value={password} onChange={(e) => {
        setPassword(e.target.value);
      }}/>
      {type=="signup" && <input className="email-input" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => {
        setConfirmPassword(e.target.value);
      }}/>}
      <div className="hyperlink-container">
        {type == "user" && <button onClick={() => {
          setType("signup");
        }} className="link-button">SignUp?</button>}
        <button onClick={() => {
          if(type == "signup"){
            setType("user");
          }
          else if(type == "admin"){
            
          } // Temp logout 
          else{
            userLogout();
          }
          
        }} className="link-button">{type=="signup"? "SignIn?" : "Forgot Password?"}</button> 
      
      </div>
      <button onClick={()=>{
        if(type == "signup"){
          userSignUp(email, password);
        } else if(type == "admin"){
          adminLogin(email, password);
          
        } else if(type == "user"){
          userLogin(email, password);
        }
      }} className="admin-user-button">{type == "signup"? "SIGNUP" : "LOGIN" }</button>
    </div>
    </>
  )
}