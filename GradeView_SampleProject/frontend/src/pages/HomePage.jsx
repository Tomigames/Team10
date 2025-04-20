import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Welcome to GradeView</h1>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/signup"><button>Sign Up</button></Link>
      </div>
    </div>
  );
}
