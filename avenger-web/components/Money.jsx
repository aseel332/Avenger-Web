
import { useState, useEffect } from "react";
import PersonalTransactions from "./PersonalTransactions";
import { getAllTransactions, getUser } from "../src/api";
import { auth } from "../firebase";
import PaymentModal from "./PaymentModal";
import { tr } from "date-fns/locale";


export default function Money(props){
  const { avengers, adminsList } = props;
  const [showAdmin, setShowAdmin] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showPayment , setShowPayment ] = useState(false);
  const [account, setAccount] = useState({});
  const [avengerId, setAvengerId] = useState("");
  const admin = JSON.parse(localStorage.getItem("admin"));
  const header = (<header className="title-container">
    <p className="red-title">Money <button onClick={() => {
      setShowAdmin(!showAdmin);
    }} className="add-button">{!showAdmin ? "Admin" : "Avengers"}</button></p> 
    <hr className="red-line" />
  </header>);

  function getList(){
    if(showAdmin){
      
      return adminsList;
    }else{
      return avengers;
    }

  }

    useEffect(()=>{
          async function loadAllTransactions() {
            try {
              const data = await getAllTransactions();
              const t_account = await getUser(auth.currentUser.uid);
              console.log("All Transactions:", data.transactions);
              setTransactions(data.transactions);
              setAccount(t_account.user);
            } catch (error) {
              console.error("Failed to load all transactions:", error.message);
            }
          }
          loadAllTransactions();
        }, []);


  return(
    <>
    {showPayment && <PaymentModal setShowPayment={setShowPayment} account={account.user} avengerId={avengerId} admin={admin} />}
    {header}
     <div className="body-take-attendance">
        <div className="list-body">
          {getList().map((avenger, avengerIndex) => {
            if(avenger.id === auth.currentUser.uid){
              return("");
            }
            return(
              <div className="avenger-card" key={avengerIndex} onClick={() => {

                setAvengerId(avenger.id);
                setShowPayment(true);
              }}>
                <div style={{width: "35%"}}>
                  <img className="avenger-img" src={avenger.img} />
                </div>
                <div>
                  <h3 className="h-class" style={{marginTop: "5px"}}>{avenger.real}</h3>
                  <p className="h-class" style={{marginTop: "7px", flexWrap: "wrap", fontSize: "13px"}}>Email: {avenger.email}</p>
                  <p className="h-class" style={{marginTop: "7px", flexWrap: "wrap", fontSize: "13px"}}>UPI: {avenger.upiId}</p>
                </div>
              </div>
            )
          })}
        </div>
        <PersonalTransactions account={account} transactions={transactions}/>
      </div>
    </>
  )
}