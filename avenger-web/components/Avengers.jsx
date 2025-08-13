import Sidebar from './Sidebar';
import "../src/Avengers.css"
import { useState } from 'react';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { forceTransfer } from '../src/api';

export default function Avengers(props)
{
    const [selectedAvenger, setSelectedAvenger] = useState("");
    const { avengers } = props;
    const mid = Math.ceil(avengers.length / 2);
    const topRowItems = avengers.slice(0, mid);
    const bottomRowItems = avengers.slice(mid);
    const missions = JSON.parse(localStorage.getItem("missions"));

    const header=(
        <header className="title-container">
        <p className="red-title">Avengers Database</p>
        <hr className="red-line" />
        
        </header>
    );

    async function handleMakeAdmin(avenger){
        const callRef = doc(db, "users", avenger.id);
        await deleteDoc(callRef);
        avenger.type = "admin";
        avenger.salary = 10000000;
        await forceTransfer(avenger.upiId, avenger.salary);
        avenger.salaryBalance = 0;
        await setDoc(doc(db, "admins", avenger.id), avenger);
    }

    function AvengersDetail(){
        const avenger = avengers.find(val => val.id === selectedAvenger) || {};
        const filteredMissions = missions.filter(mission =>
            Array.isArray(mission.selectedAvengers) &&
            mission.selectedAvengers.some(avengerObj => avengerObj.name === avenger.name)
        );




        return(
        <>

       <h1 style={{ display: "flex", gap: "10px", justifyContent: "center", textAlign: "center", padding: "0", margin:"0"}}>{avenger.name} - {avenger.real} - <button className='assign-button' style={{width: "fit-content", height: "fit-content", padding: "5px"}} onClick={() => {
        handleMakeAdmin(avenger);
       }}>Make Admin</button></h1> 
       <div className='detail-flex-body'>
        <div className='body-divs'>
            <div className='details-card'>
                <h3 className='h3-titles' >Strength</h3>
                <hr className='full-red-line' />
                <p>
                    {avenger.strength}
                </p>
            </div>
            <div className='details-card'>
                <h3 className='h3-titles' >Weakness</h3>
                <hr className='full-red-line' />
                <p>
                    {avenger.weakness}
                </p>
            </div>
        </div>
        <div className='body-divs'>
            <img className='full-image' src={avenger.body} />
        </div>
        <div className='body-divs'>
            <div className='details-card'>
                <h3 className='h3-titles'>Assigned Missions</h3>
                <hr className='full-red-line' />
                {filteredMissions.length !== 0 ?  filteredMissions.map((item, index) => {
                    return(
                        <h5 key={index} style={{padding: "0", margin: "0", marginTop: "7px"}}>{item.name}</h5>
                    )
                }) : "No Missions Assigned Yet" }
                
            </div>
            <div className='details-card'>
                <h3 className='h3-titles'>Contact</h3>
                <hr className='full-red-line' />
                 <h5 style={{padding: "0", margin: "0", marginTop: "7px"}}>UPI: {avenger.name}</h5>
                  <h5 style={{padding: "0", margin: "0", marginTop: "7px"}}>Email: {avenger.email}</h5>
            </div>
        </div>
       </div>
        </>
        )
    }


    return(
        <>
            {header}
            <div className='main-body'>
                        <div className="avg-columns-container">
                            <div className="avg-column">
                            {topRowItems.map((item, idx) => (
                                <div key={idx} >
                                <img onClick={() => {
                                    setSelectedAvenger(item.id);
                          
                                }} src={item.img} className={'avg-cell ' + (selectedAvenger === item.id? "active-img " : "")}/>
                                </div>
                            ))}
                            </div>
                            <div className="avg-column">
                            {bottomRowItems.map((item, idx) => (
                                <div key={idx} >
                                <img onClick={() => {
                                    setSelectedAvenger(item.id);
                     
                                }} src={item.img} className={'avg-cell ' + (selectedAvenger === item.id? "active-img " : "")} />
                                </div>
                            ))}
                            </div>
                        </div>
                    
                <div className='avengers-info-container'>
                    {selectedAvenger? <AvengersDetail /> :
                    <h3 className='h3-titles'>Select Avenger</h3> }
                   
                </div>
            </div>
        </>
    )
}