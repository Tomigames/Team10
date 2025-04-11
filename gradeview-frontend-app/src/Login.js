// src/Login.js

import { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import "./AuthForm.css"; // Custom styling

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Google Sign-In successful!");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Please enter your email first.");
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
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="auth-input"
      />
      <button className="auth-button" onClick={handleLogin}>
        Login
      </button>
      <button className="google-button" onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
      <button className="forgot-password" onClick={handlePasswordReset}>
        Forgot Password?
      </button>
    </div>
  );
}

export default Login;
