// src/components/CreditSummary.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../App';

const CreditSummary = ({ userId }) => {
  // State
  const [credits, setCredits] = useState({ completed: 0, remaining: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompleted, setEditedCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchCreditData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/users/${userId}/credits`);
        setCredits(res.data);
        setEditedCompleted(res.data.completed);
      } catch (err) {
        console.error('Error fetching credit data:', err);
        setError('Failed to load credit information');
      } finally {
        setLoading(false);
      }
    };

    fetchCreditData();
  }, [userId]);

  // Ensure input is non-negative
  const handleInputChange = e => {
    setEditedCompleted(Math.max(0, parseInt(e.target.value, 10) || 0));
  };

  // Never go below zero
  const calculateRemaining = comp => {
    const total = 120;
    return Math.max(0, total - comp);
  };

  // Save edited value back into "official" credits
  const handleSave = () => {
    setCredits({
      completed: editedCompleted,
      remaining: calculateRemaining(editedCompleted)
    });
    setIsEditing(false);
  };

  if (loading) return <div>Loading credit information…</div>;
  if (error)   return <div style={{ color: 'red' }}>{error}</div>;

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

      {/* Profile block */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{
          width: '100px', height: '100px',
          borderRadius: '50%', backgroundColor: '#e0e0e0',
          margin: '0 auto 15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '50%', backgroundColor: '#d0e6f2'
          }} />
        </div>
        <h2 style={{ margin: 0, fontSize: '24px' }}>Jane Doe</h2>
        <p style={{ margin: '5px 0', color: '#555' }}>Net ID</p>
      </div>

      {/* Credit cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#fff',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <label>Credits Completed:</label>
          {isEditing ? (
            <input
              type="number"
              value={editedCompleted}
              onChange={handleInputChange}
              min="0"
              style={{
                width: '60px',
                padding: '5px',
                marginLeft: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          ) : (
            <span style={{ float: 'right', fontWeight: 'bold' }}>
              {credits.completed}
            </span>
          )}
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#fff',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <label>Credits Remaining:</label>
          <span style={{ float: 'right', fontWeight: 'bold' }}>
            {isEditing
              ? calculateRemaining(editedCompleted)
              : credits.remaining}
          </span>
        </div>
      </div>

      {/* Edit / Save button */}
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        {isEditing ? (
          <button
            onClick={handleSave}
            style={{
              padding: '8px 20px',
              backgroundColor: '#a8d1f0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: '8px 20px',
              backgroundColor: '#a8d1f0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default CreditSummary;
