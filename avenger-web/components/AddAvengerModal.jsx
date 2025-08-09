// AddAvengerModal.jsx
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './AddAvengerModal.css';
import { use, useState } from 'react';
import { auth, db } from '../firebase';
import { uploadImageToCloudinary } from '../CloudinaryHelper';
import { createAccount } from '../src/api';
import { format, formatDate } from 'date-fns';
import { formatDateDDMMYY } from '../utils/dateUtils';

export default function AddAvengerModal({ setInitial }) {
  const [realName, setRealName] = useState('');
  const [name, setName] = useState('');
  const [strength, setStrength] = useState('');
  const [weakness, setWeakness] = useState('');
  const [salary, setSalary] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [fullBodyPhoto, setFullBodyPhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can handle form submission here
    const formData = new FormData();
    formData.append('realName', realName);
    formData.append('salary', salary);
    formData.append('profilePhoto', profilePhoto);
    formData.append('fullBodyPhoto', fullBodyPhoto);
    const callRef = doc(db, "users", auth.currentUser.uid);
    const url_profile = await uploadImageToCloudinary(profilePhoto);
    const url_body = await uploadImageToCloudinary(fullBodyPhoto);
    const snap = await getDoc(callRef);
    const email = snap.data().email;
    const user = await createAccount(auth.currentUser.uid, realName, email);
    await updateDoc(callRef, {
      real : realName,
      name: name,
      npd: formatDateDDMMYY(Date.now()),
      strength: strength,
      weakness: weakness,
      img: url_profile,
      body: url_body, 
      upiId: user.user.upiId,
      salary: Number(salary),
      salaryBalance: 0,
      missionBalance: 0,
    })
    // Do something with formData (like sending to backend)
    console.log('Form submitted!');
    setInitial(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Avenger</h2>

        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input
                type="text"
                value={name}
                onChange = {(e) => setName(e.target.value)}
                required
               />
            </label>
          <label>
            Real Name:
            <input
              type="text"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              required
            />
            
          </label>
        <label>Strength:</label>
        <textarea
  value={strength}
  className="modal-input"
  id="strength"
  name="strength"
  placeholder="Your Strength..."
  rows="5"
  style={{
    color: 'white',
    backgroundColor: '#2c2c2c', // 👈 dark gray background so white text is visible
    height: "14vh",
    padding: "10px",
    marginTop: "6px",
    width: "100%",
    border: "1px solid #555",
    borderRadius: "6px",
    fontSize: "15px"
  }}
  onChange={(e) => setStrength(e.target.value)}
></textarea>
<label>Weakness</label>
<textarea
  value={weakness}
  className="modal-input"
  id="weakness"
  name="weakness"
  placeholder="Your Weakness..."
  rows="5"
  style={{
    color: 'white',
    backgroundColor: '#2c2c2c', // 👈 dark gray background so white text is visible
    height: "14vh",
    padding: "10px",
    marginTop: "6px",
    width: "100%",
    border: "1px solid #555",
    borderRadius: "6px",
    fontSize: "15px"
  }}
  onChange={(e) => setWeakness(e.target.value)}
></textarea>

          <label>
            Salary (in USD):
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </label>

          <label>
            Profile Photo:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
              required
            />
          </label>

          <label>
            Full Body Photo:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFullBodyPhoto(e.target.files[0])}
              required
            />
          </label>

          <div className="modal-actions">
            <button type="submit">Add</button>
            <button type="button" onClick={() => setInitial(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}