// Frontend - React (Notification Triggers)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationTriggers = () => {
  const [lowGradeAlert, setLowGradeAlert] = useState(false);
  const [newGradeAlert, setNewGradeAlert] = useState(false);
  const [followUpAlert, setFollowUpAlert] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch saved preferences
    axios.get('/api/notification-triggers')
      .then(res => {
        const data = res.data;
        setLowGradeAlert(data.lowGradeAlert);
        setNewGradeAlert(data.newGradeAlert);
        setFollowUpAlert(data.followUpAlert);
      })
      .catch(() => setMessage('Failed to load preferences.'));
  }, []);

  const handleSave = () => {
    axios.post('/api/notification-triggers', {
      lowGradeAlert,
      newGradeAlert,
      followUpAlert
    })
    .then(() => setMessage('Notification preferences saved!'))
    .catch(() => setMessage('Error saving preferences.'));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Notification Triggers</h2>

      <label className="block mb-2">
        <input
          type="checkbox"
          checked={lowGradeAlert}
          onChange={() => setLowGradeAlert(!lowGradeAlert)}
          className="mr-2"
        />
        Alert me if my grade drops below 70
      </label>

      <label className="block mb-2">
        <input
          type="checkbox"
          checked={newGradeAlert}
          onChange={() => setNewGradeAlert(!newGradeAlert)}
          className="mr-2"
        />
        Notify me when a new grade is posted
      </label>

      <label className="block mb-4">
        <input
          type="checkbox"
          checked={followUpAlert}
          onChange={() => setFollowUpAlert(!followUpAlert)}
          className="mr-2"
        />
        Follow-up if grade stays low for 2+ weeks
      </label>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Preferences
      </button>

      {message && <p className="mt-2 text-blue-600">{message}</p>}
    </div>
  );
};

export default NotificationTriggers;
