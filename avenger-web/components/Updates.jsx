function UpdateCard(){
  return(
    <div className="update-card">
      <h3 className="h-class update-type">Transaction</h3>
      <div style={{display: "flex", gap: "10px", }}>
      <p className="h-class update-des" >Iron man transferred $5000 to Captain America</p>
      <div>
        <p className="h-class">Date: 12/12/2024</p>
        <p className="h-class">Time: 4:00</p>
      </div>
      </div>
      
    </div>
  )
}

export default function Updates(){
  return(
    <div className="black-box">
      <h1 className="box-title">Updates</h1>
      <hr className="box-line" />
      <div className="update-list">
        <UpdateCard />
        <UpdateCard />
      </div>
    </div>
  )
}