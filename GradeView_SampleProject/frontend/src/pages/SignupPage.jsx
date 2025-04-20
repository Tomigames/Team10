import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const [u, setU] = useState(''), [p, setP] = useState(''), [err, setErr] = useState('');
  const { signup } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      await signup(u, p);
      nav('/courses');
    } catch (e) {
      setErr(e.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Sign Up</h2>
      {err && <p style={{color:'red'}}>{err}</p>}
      <form onSubmit={submit}>
        <input placeholder="Username" value={u} onChange={e=>setU(e.target.value)} required /><br/>
        <input type="password" placeholder="Password" value={p} onChange={e=>setP(e.target.value)} required /><br/>
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
