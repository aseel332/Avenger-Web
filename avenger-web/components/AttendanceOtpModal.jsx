import ReactDom from "react-dom";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import LiveTimer from "./LiveTimer";
import { ca } from "date-fns/locale";

export default function AttendanceOtpModal({ call, onClose }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const timer = setTimeout(() => {
      alert("Attendance call expired.");
      onClose();
    }, call.expiresAt - Date.now());

    return () => clearTimeout(timer);
  }, [call, onClose]);

  const handleVerifyOtp = async () => {
    if (!currentUser) return;
    console.log(call);
    const expectedOtp = (call.otps[auth.currentUser.uid]);
    console.log(expectedOtp.otp);
    if (otp !== expectedOtp.otp) {
      alert("Incorrect OTP");
      return;
    }

    setLoading(true);
    try {
      const callRef = doc(db, "attendanceCalls", call.callId);
      await updateDoc(callRef, {
        [`responses.${currentUser.uid}`]: true,
      });

      alert("Attendance marked successfully!");
      onClose();
    } catch (err) {
      alert("Failed to verify attendance. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return ReactDom.createPortal(
    <div className="modal-container">
      <button  className="modal-underlay" />
      <div className="modal-content">
        <div className="modal-header">Attendance Request</div>
        <div className="modal-body">
          <div className="modal-sub-body">
            <strong>Event:</strong> {call.name}
          </div>
          <div className="modal-sub-body">
            <strong>Description:</strong> {call.description || "No description"}
          </div>
          <div className="modal-sub-body">
            <strong>Time Left:</strong> <LiveTimer type={"attendance"} expiresAt={call.expiresAt}/>
          </div>
          <div className="modal-sub-body">
            <input
              value={otp}
              className="modal-input"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
            
          </div>
          <div className="modal-sub-body">
            <button
              className="modal-button"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Submit"}
            </button>
            <button onClick={onClose} className="modal-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
