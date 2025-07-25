import Sidebar from './Sidebar';
import "../src/Avengers.css"
import { useState } from 'react';

export default function Avengers(props)
{
    const [selectedAvenger, setSelectedAvenger] = useState("");
    const { avengers } = props;
    const mid = Math.ceil(avengers.length / 2);
    const topRowItems = avengers.slice(0, mid);
    const bottomRowItems = avengers.slice(mid);
    const missions = JSON.parse(localStorage.getItem("missions"));
    console.log(missions);
    const header=(
        <header className="title-container">
        <p className="red-title">Avengers Database</p>
        <hr className="red-line" />
        
        </header>
    );

    function AvengersDetail(){
        const avenger = avengers.find(val => val.id === selectedAvenger) || {};
        const filteredMissions = missions.filter(mission =>
    Array.isArray(mission.selectedAvengers) &&
    mission.selectedAvengers.some(avengerObj => avengerObj.name === avenger.name)
);




        return(
        <>
       <h1 style={{ textAlign: "center", padding: "0", margin:"0"}}>{avenger.name} - {avenger.real}</h1>
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
            <h3 style={{padding: "0", margin: "0"}}>Image Dalo</h3>
        </div>
        <div className='body-divs'>
            <div className='details-card'>
                <h3 className='h3-titles'>Assigned Missions</h3>
                <hr className='full-red-line' />
                {filteredMissions.map((item, index) => {
                    return(
                        <h5 key={index} style={{padding: "0", margin: "0", marginTop: "5px"}}>{item.name}</h5>
                    )
                }) }
                
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
                                    console.log(selectedAvenger);
                                }} src={item.img} className={'avg-cell ' + (selectedAvenger === item.id? "active-img " : "")}/>
                                </div>
                            ))}
                            </div>
                            <div className="avg-column">
                            {bottomRowItems.map((item, idx) => (
                                <div key={idx} >
                                <img onClick={() => {
                                    setSelectedAvenger(item.id);
                                    console.log(selectedAvenger);
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