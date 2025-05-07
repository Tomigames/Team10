// LoginPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Assuming you'll create this
import './Login.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5051/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
    
      if (response.ok) {
        const data = await response.json();
        updateUser(data.userId);
        localStorage.setItem('userId', data.userId);
        navigate('/mainhome');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
    
  };

  return (
    <div className="container mt-5">
      <div style={{ display: 'inline-block' }}>
        
        
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <p style={{ fontSize: '0.9em', textAlign: 'center', marginBottom: '10px', marginTop: '10px', marginRight: '430px' }}>
                  Don’t have an account? <a href="/signup">Sign up</a>
                </p>
                <button role="button" className="button">Login</button>
              </form>
          

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;