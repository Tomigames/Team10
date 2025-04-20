import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import '../App.css';

export default function GradeWeightsEditor() {
  const userId   = 1;                // ◀ integration point
  const courseId = 1;                // ◀ integration point
  const term     = 'Spring 2025';    // ◀ integration point

  const [weights, setWeights] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    api.getWeights(courseId)
      .then(data => {
        console.log('Received weights data:', data);
        setWeights(data);
      })
      .catch(err => {
        console.error('Error fetching weights:', err);
        setError(err.message || 'Failed to load grade weights');
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const total = weights.reduce((sum, w) => sum + Number(w.currentWeight), 0);

  const onChange = (idx, val) => {
    const copy = [...weights];
    copy[idx].currentWeight = val;
    setWeights(copy);
  };

  const onDone = () => {
    const updates = weights.map(w => ({
      id:             w.id,
      assessmentType: w.assessmentType,
      newWeight:      Number(w.currentWeight)
    }));
    api.updateWeights(courseId, updates)
       .then(() => alert('Weights saved!'))
       .catch(err => {
         console.error('Error updating weights:', err);
         
         // Extract the error message from the response
         let errorMessage = 'Unknown error';
         if (err.response && err.response.data && err.response.data.error) {
           errorMessage = err.response.data.error;
         } else if (err.message) {
           errorMessage = err.message;
         }
         
         alert('Save failed: ' + errorMessage);
         
         
       })
       .finally(() => {
        // Refresh the weights data to show the last known good state
        api.getWeights(courseId)
          .then(data => {
            console.log('Refreshed weights after failed update:', data);
            setWeights(data);
          })
          .catch(refreshErr => {
            console.error('Error refreshing weights:', refreshErr);
          });
      });
  };

  if (loading) return <div className="container">Loading grade weights...</div>;
  
  if (error) return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>Error Loading Grade Weights</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    </div>
  );
  
  if (weights.length === 0) return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>No Grade Weights Found</h2>
          <p>There are no grade weights defined for this course.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <select className="term-select" value={term} readOnly>
            <option>{term}</option>
          </select>

          <div className="course-info">
            <div className="course-title">Course #{courseId}</div>
            <div className="course-subtitle">Example Course | Instructor Name</div>
          </div>

          <button className="button-done" onClick={onDone}>Done</button>
          <div className="pill-editing">EDITING GRADE WEIGHTS</div>
          <div className="total">{total}%</div>
        </div>

        <div className="row" onClick={() => setExpanded(e => !e)}>
          <div className="row-label">{expanded ? '˄' : '˅'}</div>
        </div>

        {expanded && weights.map((w, i) => (
          <div key={w.id} className="row">
            <div className="row-label">{w.assessmentType}</div>
            <div className="arrow">v</div>
            <div className="pill-weight">
              <input
                type="number"
                value={w.currentWeight}
                onChange={e => onChange(i, e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  textAlign: 'center'
                }}
              />%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
