import { auth } from "../firebase";
import { extractDate, extractTime, formatDMY, formatHM } from "../utils/dateUtils";
import { useState } from "react";
import PersonalAccount from "./PersonalAccount";

export default function PersonalTransactions(props){
  const { transactions, account} = props;
  const admin = JSON.parse(localStorage.getItem("admin"));
  const type = JSON.parse(localStorage.getItem("login"));
  const [showAccount, setShowAccount] = useState(false);
  function sortByTimestampDescending(array) {
  return array.sort((b,a) => new Date(a.date) - new Date(b.date));
}


  if(showAccount === false){
  return(
    <>
    <div className="black-box">
      <h2 style={{display: "flex"}} className="h-class box-title">Personal Transactions {type === "user" && <button className="add-button" onClick={() => {
        setShowAccount(!showAccount);
      }}>{! showAccount ? "Account" : "Transfers"}</button>}</h2>
      <hr className="box-line" />
      <div className="transaction-list">
        {sortByTimestampDescending(transactions).map((transaction, transactionIndex)=>{
          
          if(transactionIndex > 5){
            return;
          }

          if(transaction.to === auth.currentUser.uid){
            return(
              <div key={transactionIndex} style={{ fontFamily: "sans-serif", marginBottom: "15px"}}> 
              <div style={{display: "flex", flex: "1",width: "100%"}}>
                <h3 className="h-class" style={{width: "90%"}}>From {transaction.fromName}</h3>
                <h3 className="h-class" style={{color: "green", textAlign: "right"}}>${transaction.amount}</h3>
              </div>
              <h5 className="h-class">Date: {formatDMY(transaction.date)} - Time: {formatHM(transaction.date)}</h5>
              </div>
            )
          }
          if(transaction.from === auth.currentUser.uid){
            return(
              <div key={transactionIndex} style={{fontFamily: "sans-serif", marginBottom: "15px"}}> 
              <div style={{display: "flex", flex: "1", width: "100%"}}> 
                <h3 className="h-class" style={{width: "90%"}}>To {transaction.toName}</h3>
                <h3 className="h-class" style={{color: "red", textAlign: "right"}}>${transaction.amount}</h3>
              </div>
              <h5 className="h-class">Date: {formatDMY(transaction.date)} - Time: {formatHM(transaction.date)}</h5>
              </div>
            )
          }
        })}
      </div>
    </div>
    </>
  )
}else{
  return(
    <PersonalAccount account={account.user} admin={admin} setShowAccount={setShowAccount} />
  )
}
}