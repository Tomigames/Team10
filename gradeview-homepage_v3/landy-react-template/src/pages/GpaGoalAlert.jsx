import React, { useState, useEffect } from 'react';
import './App.css';

const GpaGoalAlerts = ({ goBack }) => {
  const [goal, setGoal] = useState('');
  const [notificationPref, setNotificationPref] = useState('email');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5050/api/gpa-goal')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setGoal(data.goal);
          setNotificationPref(data.preference);
        }
      });
  }, []);

  const handleSave = () => {
    fetch('http://127.0.0.1:5050/api/gpa-goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, preference: notificationPref }),
    })
      .then(() => setAlertMessage('✅ Preferences saved!'))
      .catch(() => setAlertMessage('❌ Failed to save preferences.'));
  };

  return (
    <div className="settings-page">
      <h2 className="section-title">GPA Goal Alerts</h2>
      <div className="settings-box">
        <label>
          GPA Goal:{' '}
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </label>{' '}
        <label>
          Notification Preference:{' '}
          <select
            value={notificationPref}
            onChange={(e) => setNotificationPref(e.target.value)}
          >
            <option value="email">Email</option>
            <option value="dashboard">Dashboard</option>
          </select>
        </label>{' '}
        <button onClick={handleSave}>Save Preferences</button>
        {alertMessage && <p className="success-text">{alertMessage}</p>}
      </div>
      <button className="back-btn" onClick={goBack}>⬅ Back to Notifications</button>
    </div>
  );
};

export default GpaGoalAlerts;
