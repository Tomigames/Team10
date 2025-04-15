// src/ForgotPassword.js

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import "./AuthForm.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />

      <button className="auth-button" onClick={handlePasswordReset}>
        Send Reset Email
      </button>

      <p style={{ marginTop: "10px" }}>
        Remembered your password? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
