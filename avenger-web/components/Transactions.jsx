import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { formatDMY, formatHM } from "../utils/dateUtils";
import { getAllTransactions } from "../src/api";
import PersonalTransactions from "./PersonalTransactions";

export default function Transactions(props){
  const [transactions, setTransactions] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const { avengers } = props;
  

function getName(avengerId) {
  const avenger = avengers.find(avenger => avenger.id === avengerId);
  return avenger ? avenger.real : "SYSTEM";
}


  const getWeekRange = (offset = 0) => {
      const start = dayjs().startOf("week").add(offset, "week");
      const end = start.endOf("week");
      return { start, end };
    };
  
  const { start, end } = getWeekRange(weekOffset);
  
  const filteredData = transactions
    .filter(call =>
      dayjs(call.expiresAt).isAfter(start) &&
      dayjs(call.expiresAt).isBefore(end)
    );

  const header = (<header className="title-container">
      <p className="red-title">Transactions</p> 
    <hr className="red-line" /> 
    </header>);

    

    useEffect(()=>{
      async function loadAllTransactions() {
        try {
          const data = await getAllTransactions();
          console.log("All Transactions:", data.transactions);
          setTransactions(data.transactions);
        } catch (error) {
          console.error("Failed to load all transactions:", error.message);
        }
      }
      loadAllTransactions();
    }, []);

    function Transaction(props){
      const { transaction } = props;
      return(
        <>
          <div className="header-card">
            <div className="attendance-name">{`${transaction.fromName} - ${transaction.toName}`}</div>
            <div className="attendance-sub-head">Date: <span className="value-info">{ formatDMY(transaction.date)}</span></div>
            <div className="attendance-sub-head">Time: <span className="value-info">{formatHM(transaction.date)}</span></div>
          </div>
          <h2>Amount: ${transaction.amount} </h2>
        </>
      )
    }

  return(
    <>
      {header}
      <div className="body-take-attendance">
        <div className="attendance-body">
          <div className="week-header">
            <button onClick={() => setWeekOffset(w => w - 1)} className="week-button">←</button>
            <h2 className="text-xl font-bold">
              Week: {start.format("DD MMM")} – {end.format("DD MMM")}
            </h2>
            <button onClick={() => setWeekOffset(w => w + 1)} className="week-button">→</button>
          </div>
          {filteredData.length === 0 ? (
          <p style={{textAlign: "center"}}>No transaction data for this week.</p>
          ) :
          (filteredData.map((transaction, transactionIndex) => {
            return(
              <div key={transactionIndex} className="attendance-card">
              <Transaction transaction={transaction} transactionIndex={transactionIndex} />
              </div>
            )
          })) 
        }
        
        </div>
        <PersonalTransactions transactions={transactions} />
      </div>

    </>
  )
}