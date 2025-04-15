// src/Signup.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import "./AuthForm.css";
import googleLogo from "./assets/Google/google-logo.png";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      alert("Signup successful!");

      await setDoc(doc(db, "users", user.uid), {
        FirstName: firstName,
        LastName: "",
        Email: user.email,
        PhoneNumber: "",
        NetID: "",
        GPA: "",
        Credits: 0
      });

      console.log("User profile created in Firestore!");

      navigate("/profile");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        FirstName: user.displayName?.split(" ")[0] || "",
        LastName: user.displayName?.split(" ")[1] || "",
        Email: user.email,
        PhoneNumber: "",
        NetID: "",
        GPA: "",
        Credits: 0
      });

      console.log("Google Signup profile created in Firestore!");

      navigate("/profile");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="auth-input"
      />
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

<button className="auth-button" onClick={handleSignup}>
  Sign Up
</button>


<button className="google-button" onClick={handleGoogleSignup}>
  <img src={googleLogo} alt="Google Logo" />
  Sign Up with Google
</button>




      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Signup;
