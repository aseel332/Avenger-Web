import ReactDom from 'react-dom';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getUser, requestOtp, verifyOtp } from '../src/api';

export default function PaymentModal(props){
  const {setShowPayment, account, avengerId} = props;
  const [fromUpi, setFromUpi] = useState(account.upiId);
  const [toUpi, setToUpi] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    async function loadReciever() {
      try {
              
              const response = await getUser(avengerId);
              setToUpi(response.user.upiId);
              
            } catch (err) {
              console.error("Error fetching user:", err.message);
            }
    }
    loadReciever();
  })

  const handleRequestOtp = async () => {
  try {
    setLoading(true);
    console.log("Requesting OTP for:", fromUpi, "to:", toUpi, "amount:", amount);
    const res = await requestOtp(fromUpi, toUpi, Number(amount));
    console.log("OTP Response:", res);
    alert("OTP has been sent to your email linked with UPI.");
    setOtpRequested(true);
  } catch (err) {
    alert("Error requesting OTP: " + err.message);
  } finally {
    setLoading(false);
  }
};

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const response = await verifyOtp(fromUpi, otp);
      alert("Payment Successful!");
      console.log("Payment response:", response);
      
      setShowPayment(false);

    } catch (err) {
      alert("Error verifying OTP: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  
  return ReactDom.createPortal(
  <div className='modal-container'>
    <button onClick={() => {
      setShowPayment(false);
    }} className='modal-underlay' />
    <div className='modal-content'> 
      <div className='modal-header'>
        Payment Portal
      </div>
      <div className='modal-body'>
        { !otpRequested && (<><div className='modal-sub-body'>
        <input value={fromUpi} className='modal-input' placeholder='Your UPI' onChange={(e) => {
          setFromUpi(e.target.value);
        }} /> 
        <input value={toUpi} className='modal-input' type='text' placeholder='To' onChange={(e) => {
          setToUpi(e.target.value);
        }} />
        </div>
         <div className='modal-sub-body'>
        <input value={amount} className='modal-input' placeholder='Amount' onChange={(e) => {
          setAmount(Number(e.target.value));
        }} /> 
        </div>
        <div></div>
        <label style={{
          marginTop: "5px",
          textAlign: "left",
          marginLeft: "-82%"
        }}>Description:</label><br />

        <textarea value={description} style={{color: 'white', height: "14vh", padding: "4px", marginTop:"6px", width: "100%"}} className='modal-input' id="description" name="description" rows="10" cols="50" placeholder="Describe Payment" onChange={(e) => {
          setDescription(e.target.value);
        }}></textarea>

        <div className='modal-sub-body'>
          <button className='modal-button' onClick={handleRequestOtp}>Pay</button> 
          <button onClick={()=>{
            setShowPayment(false);
            
          }} className='modal-button'>Cancel</button>
        </div></>)}

          {otpRequested && (
            <div className='modal-sub-body'>
              <input
                value={otp}
                className='modal-input'
                placeholder='Enter OTP'
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className='modal-button'
                onClick={()=>{
                  console.log(fromUpi);
                  handleVerifyOtp();
                }}
                disabled={loading}
              >
                {loading ? "Processing..." : "Verify & Pay"}
              </button>
            </div>
          )}

      </div>
    </div>
  </div>,
  document.getElementById('portal')
  )
}