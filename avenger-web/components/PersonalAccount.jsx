export default function PersonalAccount(props){
  const { account, admin, setShowAccount, } = props;
  const type = JSON.parse(localStorage.getItem("login"));
  console.log(account)
  return(
    <div className="black-box">
      <h2 className="h-class box-title">Personal Account {type === "user" && <button className="add-button" onClick={() => {
        setShowAccount(false);
      }}>{"Transfers"}</button>}</h2>
      <hr className="box-line" />
      <div className="box-content">
        <div style={{textAlign: "center"}}>
          <img className="perosnal-img" src={admin.img} />
        </div>
        <div>
          <h3 className="h-class">{admin.real}</h3>
        </div>
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">Account Number:</h4> <h4 className="h-class sub-value"> {account.accountNumber}</h4>
        </div>
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">UPI Id:</h4> <h4 className="h-class sub-value"> {admin.upiId}</h4>
        </div>
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">Current Balance:</h4> <h4 className="h-class sub-value"> ${account.balance}</h4>
        </div>
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">Salary:</h4> <h4 className="h-class sub-value"> ${admin.salary}</h4>
        </div>
        {type === "user" && (
          <>
          <div className="sub-body-acc">
          <h4 className="h-class sub-text">Salary Balance:</h4> <h4 className="h-class sub-value"> ${admin.salaryBalance}</h4>
        </div>
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">Mission Balance:</h4> <h4 className="h-class sub-value"> ${admin.missionBalance}</h4>
        </div>
        </>
        )}
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">LPD:</h4> <h4 className="h-class sub-value">{admin.lpd}</h4>
        </div>
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">NPD:</h4> <h4 className="h-class sub-value">{admin.npd}</h4>
        </div>
      </div>
    </div>
  )
}