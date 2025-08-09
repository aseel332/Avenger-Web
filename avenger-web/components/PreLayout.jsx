import Alertcard from "./Alertcard";
import JarvisCard from "./JarvisCard";
import { useState } from "react";
import Login from "./Login";

export default function PreLayout(){

 

  const [click, setClick] = useState(false);
  const [type, setType] = useState('');

  const titleCard = (
    <div className="left-card-hero">
      <p className="avenger-title">AVENGERS</p>
      <p className="avenger-sub-title">WELCOME  TO  THE  HEADQUARTERS</p>
    </div>  
  );
  
  return(
    <div className="container-prelayout">
    <div className="left-main box"> 

      {titleCard}

      <div className="alert-card">
        <Alertcard />
      </div>
    </div>
    <div className="right-main">
      {click? <Login type={type} setType={setType} setClick={setClick} /> : <JarvisCard setClick={setClick} setType={setType}/>}
    </div>
    </div>
    
  )
}