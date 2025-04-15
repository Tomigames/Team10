// src/Login.js

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Corrected import
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./AuthForm.css";
import googleLogo from "./assets/Google/google-logo.png"; // ✅ Google logo

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      alert("Login successful!");

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log("User profile data:", userDoc.data());
      } else {
        console.log("No profile data found in Firestore for this user.");
      }

      navigate("/profile");

    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      alert("Google Sign-In successful!");

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log("User profile data:", userDoc.data());
      } else {
        console.log("No profile data found in Firestore for this user.");
      }

      navigate("/profile");

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

      <button 
        className="google-button" 
        onClick={handleGoogleLogin}
      >
        <img 
          src={googleLogo} 
          alt="Google Logo" 
        />
        Sign in with Google
      </button>

      <Link to="/forgot-password" className="forgot-password">
        Forgot Password?
      </Link>
    </div>
  );
}

export default Login;
