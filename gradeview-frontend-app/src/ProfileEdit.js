// src/ProfileEdit.js
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
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
        console.log("Logged in user UID:", user.uid);
        setUserId(user.uid);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.FirstName || "");
          setLastName(data.LastName || "");
          setEmail(data.Email || "");
          setPhone(data.PhoneNumber || "");
          setNetID(data.NetID || "");
          setGPA(data.GPA || "");
          setCredits(data.Credits || "");

          // Auto-fix missing fields
          const updates = {};
          if (!data.NetID) updates.NetID = "";
          if (!data.PhoneNumber) updates.PhoneNumber = "";
          if (!data.GPA) updates.GPA = "";
          if (!data.Credits) updates.Credits = 0;

          if (Object.keys(updates).length > 0) {
            console.log("Auto-fixing missing fields:", updates);
            await updateDoc(userDocRef, updates);
          }
        } else {
          console.log("No profile found for this UID in Firestore.");
        }
      } else {
        console.log("No user is logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      alert("No user logged in.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        FirstName: firstName,
        LastName: lastName,
        PhoneNumber: phone,
        NetID: netID,
      });

      alert("Profile updated successfully!");
      console.log("Profile updated:", { firstName, lastName, phone, netID });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2>User Information</h2>

      {/* 🚫 Photo upload section removed */}

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
        <input
          type="email"
          value={email}
          disabled
        />
      </div>

      <div className="form-group">
        <label>GPA</label>
        <input
          type="text"
          value={gpa}
          disabled
        />
      </div>

      <div className="form-group">
        <label>Number of Credits</label>
        <input
          type="text"
          value={credits}
          disabled
        />
      </div>

      <button className="save-button" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}

export default ProfileEdit;
