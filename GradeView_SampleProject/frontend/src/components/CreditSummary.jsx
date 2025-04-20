import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

export default function CreditSummary() {
  const userId = 1; // ◀ integration point

  const [credits, setCredits] = useState({ completed: 0, remaining: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompleted, setEditedCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getCredits(userId)
      .then(data => {
        setCredits(data);
        setEditedCompleted(data.completed);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleInputChange = e => {
    const parsed = Math.max(0, parseInt(e.target.value, 10) || 0);
    setEditedCompleted(parsed);
  };

  const calculateRemaining = () => {
    const totalNeeded = 120;
    return Math.max(0, totalNeeded - editedCompleted);
  };

  const toggleEdit = () => {
    if (isEditing) {
      setCredits({ completed: editedCompleted, remaining: calculateRemaining() });
    }
    setIsEditing(!isEditing);
  };

  if (loading) return <div>Loading credit information...</div>;

  return (
    <div style={{
      backgroundColor: '#e8f4f8',
      padding: '20px',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'transparent',
        border: 'none',
        fontSize: '16px',
      }}>
        {/* no-op: nav buttons live in App.jsx */}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          backgroundColor: '#e0e0e0', margin: '0 auto 15px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '50%', backgroundColor: '#d0e6f2'
          }} />
        </div>
        <h2 style={{ margin: 0, fontSize: '24px' }}>Jane Doe</h2>
        <p style={{ margin: '5px 0', color: '#555' }}>Net ID</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{
          padding: '15px', backgroundColor: '#fff',
          borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <label>Credits Completed:</label>
          {isEditing ? (
            <input
              type="number"
              value={editedCompleted}
              onChange={handleInputChange}
              style={{
                width: '60px', padding: '5px',
                marginLeft: '10px', border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              min="0"
            />
          ) : (
            <span style={{ float: 'right', fontWeight: 'bold' }}>
              {credits.completed}
            </span>
          )}
        </div>

        <div style={{
          padding: '15px', backgroundColor: '#fff',
          borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <label>Credits Remaining:</label>
          <span style={{ float: 'right', fontWeight: 'bold' }}>
            {isEditing ? calculateRemaining() : credits.remaining}
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <button
          onClick={toggleEdit}
          style={{
            padding: '8px 20px',
            backgroundColor: '#a8d1f0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
    </div>
  );
}
