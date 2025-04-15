// src/ProfileEdit.js
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./ProfileEdit.css";

function ProfileEdit() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [netID, setNetID] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gpa, setGPA] = useState("");
  const [credits, setCredits] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setEmail(user.email);

        try {
          const res = await fetch(`http://localhost:5000/api/users/${user.email}`);
          const data = await res.json();

          if (data) {
            setFirstName(data.FirstName || "");
            setLastName(data.LastName || "");
            setNetID(data.NetID || "");
            setPhone(data.PhoneNumber || "");
            setGPA(data.GPA || "");
            setCredits(data.Credits || "");
          } else {
            console.log("No profile found for this user.");
          }
        } catch (err) {
          console.error("Error loading profile:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,         // used to identify the record
          firstName,
          lastName,
          netID,
          phoneNumber: phone,
        }),
      });

      const result = await res.json();
      console.log("Profile updated:", result);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2>User Information</h2>

      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>NetID</label>
        <input
          type="text"
          value={netID}
          onChange={(e) => setNetID(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} disabled />
      </div>

      <div className="form-group">
        <label>GPA</label>
        <input type="text" value={gpa} disabled />
      </div>

      <div className="form-group">
        <label>Number of Credits</label>
        <input type="text" value={credits} disabled />
      </div>

      <button className="save-button" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}

export default ProfileEdit;
