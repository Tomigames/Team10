import React, { useState, useEffect } from 'react';
import { setUserIdHeader } from './services/api.js';
import GradeWeightsEditor from './components/GradeWeightsEditor.jsx';
import CreditSummary from './components/CreditSummary.jsx';

export default function App() {
  // simple toggle state
  const [page, setPage] = useState('weights');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // tell axios who we are, so the back‑end sees req.headers['x-user-id']
  useEffect(() => {
    console.log('Setting user ID header to 1');
    setUserIdHeader(1); // ◀ integration point: supply real user ID here
    setIsAuthenticated(true);
  }, []);

  // Only render components after authentication is set
  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* top‑left nav */}
      <div style={{ position: 'fixed', top: 10, left: 10, display: 'flex', gap: 8 }}>
        <button onClick={() => setPage('weights')}>Grade Weights</button>
        <button onClick={() => setPage('credits')}>Credit Summary</button>
      </div>

      {/* main content */}
      <div style={{ marginTop: 60, padding: 20 }}>
        {page === 'weights' && <GradeWeightsEditor />}
        {page === 'credits' && <CreditSummary />}
      </div>
    </div>
  );
}
