// src/App.js
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Signup from "./Signup";
import Login from "./Login";
import ProfileEdit from "./ProfileEdit";
import logo from "./logo.svg";
import "./App.css";
import ForgotPassword from "./ForgotPassword"; 

function AppContent() { // ✅ Create a separate component inside the Router
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // ✅ Now it's safely inside the Router

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const fullName = `${data.FirstName || ""} ${data.LastName || ""}`.trim();
          setUserName(fullName);
        } else {
          console.log("No user profile found.");
        }
      } else {
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <div className="App">
      <nav style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "10px", 
        backgroundColor: "#f5f5f5", 
        marginBottom: "20px",
        position: "relative"
      }}>
        {/* Left side: Logo and Links */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/">
            <img src={logo} alt="Logo" style={{ height: "40px", marginRight: "20px", cursor: "pointer" }} />
          </Link>
          <Link to="/signup" style={{ marginRight: "10px" }}>Signup</Link>
          <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
          <Link to="/profile">Profile</Link>
        </div>

        {/* Right side: User Name with Dropdown */}
        {userName && (
          <div style={{ position: "relative", marginRight: "20px", cursor: "pointer" }}>
            <div onClick={() => setShowDropdown(!showDropdown)}>
              Hello, {userName} ▼
            </div>

            {showDropdown && (
              <div style={{
                position: "absolute",
                top: "30px",
                right: "0",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                padding: "10px",
                zIndex: 100
              }}>
                <Link to="/profile" onClick={() => setShowDropdown(false)} style={{ display: "block", marginBottom: "10px" }}>
                  Profile
                </Link>
                <div 
                  onClick={handleLogout} 
                  style={{ color: "red", cursor: "pointer" }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ✅ Title */}
      <h1>Welcome to Gradeview</h1>

      {/* ✅ Page Routes */}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfileEdit />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent /> {/* ✅ Only useNavigate INSIDE here */}
    </Router>
  );
}

export default App;
