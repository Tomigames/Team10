import React, { useState, useEffect } from 'react';
import './App.css';

const NotifTrigger = ({ goBack }) => {
  const [lowGradeAlert, setLowGradeAlert] = useState(false);
  const [newGradeAlert, setNewGradeAlert] = useState(false);
  const [followUpAlert, setFollowUpAlert] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5050/api/notification-triggers')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setLowGradeAlert(data.lowGradeAlert);
          setNewGradeAlert(data.newGradeAlert);
          setFollowUpAlert(data.followUpAlert);
        }
      });
  }, []);

  const handleSave = () => {
    fetch('http://127.0.0.1:5050/api/notification-triggers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lowGradeAlert, newGradeAlert, followUpAlert }),
    })
      .then(() => setMessage('✅ Notification preferences saved!'))
      .catch(() => setMessage('❌ Error saving preferences.'));
  };

  return (
    <div className="settings-page">
      <div className="settings-box">
        <h2 className="section-title">Notification Triggers</h2>
        <div className="trigger-grid">
          <div>
            <p>Alert me if my grade drops below 70</p>
            <p>Notify me when a new grade is posted</p>
            <p>Follow up if grade stays low for 2+ weeks</p>
          </div>
          <div className="checkbox-col">
            <input
              type="checkbox"
              checked={lowGradeAlert}
              onChange={() => setLowGradeAlert(!lowGradeAlert)}
            />
            <input
              type="checkbox"
              checked={newGradeAlert}
              onChange={() => setNewGradeAlert(!newGradeAlert)}
            />
            <input
              type="checkbox"
              checked={followUpAlert}
              onChange={() => setFollowUpAlert(!followUpAlert)}
            />
          </div>
        </div>

        <div className="button-row">
          <button onClick={handleSave}>Save Preferences</button>
        </div>

        {message && <p className="success-text">{message}</p>}
      </div>

      <button className="back-btn" onClick={goBack}>⬅ Back to Notifications</button>
    </div>
  );
};

export default NotifTrigger;
