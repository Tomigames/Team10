// src/App.js
import React from 'react';
import CreditSummary from './components/CreditSummary';
import axios from 'axios';

/* ------------ API Helper ------------ */
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' }
});

function App() {
  const userId = 1; // or pull from auth/context

  return (
    <div className="App" style={{ padding: '20px' }}>
      <CreditSummary userId={userId} />
    </div>
  );
}

export default App;
