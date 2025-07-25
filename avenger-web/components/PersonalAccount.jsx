export default function PersonalAccount(props){
  const { account } = props;
  return(
    <div className="black-box">
      <h2 className="h-class box-title">Personal Account</h2>
      <hr className="box-line" />
      <div className="box-content">
        <div style={{textAlign: "center"}}>
          <img className="perosnal-img" src="../src/assets/sam.jpeg" />
        </div>
        <div>
          <h3 className="h-class">{account.name}</h3>
        </div>
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">Account Number:</h4> <h4 className="h-class sub-value"> {account.accountNumber}</h4>
        </div>
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">Current Balance:</h4> <h4 className="h-class sub-value"> ${account.balance}</h4>
        </div>
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">Salary:</h4> <h4 className="h-class sub-value"> 100000</h4>
        </div>
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">LPD:</h4> <h4 className="h-class sub-value"> 12/12/12</h4>
        </div>
        <div className="sub-body-acc">
          <h4 className="h-class sub-text">NPD:</h4> <h4 className="h-class sub-value"> 12/12/12</h4>
        </div>
      </div>
    </div>
  )
}