import { useState } from 'react';

import './SalaryCard.css';

export default function SalaryCard(props) {
  const {avengers} = props;
  const [flippedCards, setFlippedCards] = useState(new Set());

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

  return (
    <div className="salary-card-container">
      {header}

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
                      <h2 className="card-name">{hero.name}</h2>

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
                      <p className="info-title">Salary</p>
                      <p className="info-value">{hero.salary}</p>
                    </div>
                    <div className="info-block">
                      <p className="info-title">L.P.D.</p>
                      <p className="info-value">{hero.lpd}</p>
                    </div>
                    <div className="info-block">
                      <p className="info-title">N.P.D.</p>
                      <p className="info-value">{hero.npd}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div className="card-back">
                <div className="badge">
                  <img
                    src={hero.img}
                    alt="Badge"
                    className="badge-img"
                  />
                  <p className="badge-name">{hero.name}</p>
                  <p className="badge-role">Avenger ID: {index + 1001}</p>
                  <p className="badge-date">Joined: {hero.joined}</p>
                  <button className='back-pay'>Pay Salary</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}