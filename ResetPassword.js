// Brendon Nguyen, bqn230000 - React - Password Reset Component
import React, { useState } from "react";
import axios from "axios";

function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/reset-password", {
        currentPassword,
        newPassword,
      });
      setMessage("Password reset successful!");
    } catch (err) {
      setMessage("Error: " + err.response.data.error);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <br />
      <button onClick={handleReset}>Reset Password</button>
      <p>{message}</p>
    </div>
  );
}

export default ResetPassword;
