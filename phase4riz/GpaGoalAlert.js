// Frontend - React (GPA Goal Alerts + Notification Triggers)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GpaGoalAlerts = () => {
  const [goal, setGoal] = useState('');
  const [notificationPref, setNotificationPref] = useState('email');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    // Fetch previously saved settings
    axios.get('/api/gpa-goal')
      .then(res => {
        if (res.data) {
          setGoal(res.data.goal);
          setNotificationPref(res.data.preference);
        }
      });
  }, []);

  const handleSave = () => {
    axios.post('/api/gpa-goal', { goal, preference: notificationPref })
      .then(() => setAlertMessage('Settings saved successfully!'))
      .catch(() => setAlertMessage('Failed to save settings.'));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">GPA Goal Alerts</h2>
      <input
        type="number"
        placeholder="Enter GPA goal (e.g., 3.5)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="border p-2 w-full mb-3"
      />
      <select
        value={notificationPref}
        onChange={(e) => setNotificationPref(e.target.value)}
        className="border p-2 w-full mb-3"
      >
        <option value="email">Email</option>
        <option value="dashboard">Dashboard</option>
      </select>
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Preferences
      </button>
      {alertMessage && <p className="mt-2 text-green-600">{alertMessage}</p>}
    </div>
  );
};

export default GpaGoalAlerts;
