import ReactDOM from "react-dom";
import "./AvengersDetail.css"; 
import "../src/Avengers.css";

export default function AvengersDetail({ onClose }) {
  const avenger = JSON.parse(localStorage.getItem("admin"));
  const missions = JSON.parse(localStorage.getItem("missions"));
  const filteredMissions = missions.filter(mission =>
            Array.isArray(mission.selectedAvengers) &&
            mission.selectedAvengers.some(avengerObj => avengerObj.name === avenger.name)
        );

  return ReactDOM.createPortal(
    <div className="avenger-modal-overlay" onClick={onClose}>
      <div className="avenger-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="avenger-close-button" onClick={onClose}>✕</button>

        <h1 className="avenger-modal-title">
          {avenger.name} - {avenger.real}
        </h1>

        <div className="detail-flex-body">
          <div className="body-divs">
            <div className="details-card">
              <h3 className="h3-titles">Strength</h3>
              <hr className="full-red-line" />
              <p>{avenger.strength}</p>
            </div>
            <div className="details-card">
              <h3 className="h3-titles">Weakness</h3>
              <hr className="full-red-line" />
              <p>{avenger.weakness}</p>
            </div>
          </div>

          <div className="body-divs">
            <img className="full-image" src={avenger.body} />
          </div>

          <div className="body-divs">
            <div className="details-card">
              <h3 className="h3-titles">Assigned Missions</h3>
              <hr className="full-red-line" />
              {filteredMissions.length !== 0 ? (
                filteredMissions.map((item, index) => (
                  <h5 key={index} style={{ marginTop: "7px" }}>
                    {item.name}
                  </h5>
                ))
              ) : (
                "No Missions Assigned Yet"
              )}
            </div>
            <div className="details-card">
              <h3 className="h3-titles">Contact</h3>
              <hr className="full-red-line" />
              <h5 style={{ marginTop: "7px" }}>UPI: {avenger.name}</h5>
              <h5 style={{ marginTop: "7px" }}>Email: {avenger.email}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
