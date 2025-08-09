import { formatDate } from "date-fns";
import { useEffect, useState } from "react"
import { extractDate, extractTime, formatDateDDMMYY, formatTime, getFormattedDateFromCustomString, getFormattedTimeFromCustomString,   } from "../utils/dateUtils";
import { loadUpdates } from "../utils/updates";



export default function Updates(){
  const [updates, setUpdates] = useState([]);
  useEffect(() => {
    async function getUpdates() {
      const data = await loadUpdates();
      setUpdates(data);
    }
    getUpdates();
  }, [])




  function UpdateCard({ update }){
  
  return(
    
    <>
      <h3 className="h-class update-type">{update.type}</h3>
      <div style={{display: "flex", gap: "10px", }}>
      <p className="h-class update-des" >{update.detail}</p>
      <div>
        <p className="h-class">Date: {extractDate(update.createdAt)}</p>
        <p className="h-class">Time: {extractTime(update.createdAt)}</p>
      </div>
      </div>
    </>

  )
}
  return(
    <div className="black-box">
      <h1 className="box-title">Updates</h1>
      <hr className="box-line" />
      <div className="update-list">
        {updates.map((update, updateIndex) => {
          if(updateIndex > 4){
            return;
          }
          return(
            <div className="update-card" key={updateIndex}>
              <UpdateCard update={update} />
            </div>
          )
        })}
      </div>
    </div>
  )
}