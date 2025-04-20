import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [u, setU] = useState(''), [p, setP] = useState(''), [err, setErr] = useState('');
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      await login(u, p);
      nav('/courses');
    } catch (e) {
      setErr(e.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      {err && <p style={{color:'red'}}>{err}</p>}
      <form onSubmit={submit}>
        <input placeholder="Username" value={u} onChange={e=>setU(e.target.value)} required /><br/>
        <input type="password" placeholder="Password" value={p} onChange={e=>setP(e.target.value)} required /><br/>
        <button type="submit">Login</button>
      </form>
      <p>No account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
