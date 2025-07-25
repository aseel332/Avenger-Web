import { useState, useEffect } from 'react';

import './SalaryCard.css';
import PersonalAccount from './PersonalAccount';
import { auth } from '../firebase';
import { getUser } from '../src/api';
import PaymentModal from './PaymentModal';



export default function SalaryCard(props) {
  const {avengers} = props;
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [account, setAccount] = useState(null);
  const [showPayment , setShowPayment ] = useState(false);
  const [avengerId, setAvengerId] = useState("");

  const handleCardClick = (index) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const header = (
    <header className="title-container">
      <p className="red-title">Salary</p>
      <hr className="red-line" />
    </header>
  );

  useEffect(()=>{
    async function loadAccount() {
      try {
        console.log(auth.currentUser.uid);
        const response = await getUser(auth.currentUser.uid);
        setAccount(response.user);
        
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    }
    loadAccount();
  }, [])
  console.log(account);
  return (
    <>
    {showPayment && <PaymentModal setShowPayment={setShowPayment} account={account} avengerId={avengerId} />}
    <div className="salary-card-container">
      {header}
    <div style={{display: "flex", gap: "20px", width: "100vw"}}>
      <div className="card-container">
        {avengers.map((hero, index) => (
          <div 
            className={`card-flip ${flippedCards.has(index) ? 'flipped' : ''}`} 
            key={index}
            onClick={() => handleCardClick(index)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-inner">
              {/* Front Side */}
              <div className="card-front">
                <div className="card-button">
                  <div className="card-content">
                    <img
                      src={hero.img}
                      alt={hero.name}
                      className="card-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/default.png";
                      }}
                    />
                    <div className="card-details">
                      <h3 className="card-name">{hero.name}</h3>

                      <div className="balance-line">
                        <span className="balance-label">Salary Balance:</span>
                        <span className="balance-amount">{hero.salaryBalance}</span>
                      </div>

                      <div className="balance-line">
                        <span className="balance-label">Mission Balance:</span>
                        <span className="balance-amount">{hero.missionBalance}</span>
                      </div>

                      <div className="balance-line total">
                        <span className="total-label">Total:</span>
                        <span className="balance-amount">{hero.total}</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-block">
                      <p className="h-class info-title">Salary</p>
                      <p className="h-class info-value">{hero.salary}</p>
                    </div>
                    <div className="info-block">
                      <p className="h-class info-title">L.P.D.</p>
                      <p className="h-class info-value">{hero.lpd}</p>
                    </div>
                    <div className="info-block">
                      <p className="h-class info-title">N.P.D.</p>
                      <p className="h-class info-value">{hero.npd}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div className="card-back">
                <div className="badge">
                  <div className='flex-back'>
                  <img
                    src={hero.img}
                    alt="Badge"
                    className="badge-img"
                  />
                  <div className='info-flex'>
                  <span className="badge-name">{hero.name}</span>
                  <p className="badge-role">Avenger ID: 1000</p>
                  <p className="badge-date">Joined: {hero.joined}</p>
                  </div>
                  </div>
                  <button className='back-pay' onClick={()=>{
                    setShowPayment(true);
                    setAvengerId(hero.id);
                  }}>Send Money</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
        {account && <PersonalAccount account={account} />}
      </div>
    </div>
    </>
  );
}