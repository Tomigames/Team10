import React, { useEffect, useState } from 'react';
import './App.css';

const NotifPage = ({ goTo }) => {
  const [gpaGoal, setGpaGoal] = useState(null);
  const [triggers, setTriggers] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([
      '📬 You set a GPA goal of 3.5',
      '⚠️ Low grade alert enabled',
      '✅ Follow-up alert was saved',
      '📈 Your average GPA is 3.3',
      '📩 You opted in for email alerts',
      '🛎️ A new grade was posted',
      '🚨 GPA fell below 3.0',
      '📊 You received a 95% on Math Quiz',
      '🎉 New assignment grade added',
      '💬 Advisor sent you a message',
      '📉 You missed the GPA goal for March',
      '🔔 Reminder: Chemistry exam tomorrow',
      '📚 New grade posted for History paper',
      '📤 Your transcript was updated',
      '✅ Triggers updated successfully',
      '🔄 Notification settings synced',
      '📝 Assignment “Essay 2” was graded',
      '⏰ You enabled follow-up alerts',
      '📦 Weekly performance summary generated',
      '🎯 Goal progress: 92% toward GPA goal',
      '📥 You set email as your preference',
      '🎓 Final GPA for semester is 3.44',
      '📢 New semester begins next week',
      '🛠️ App updated with new features!',
      '📨 New feedback on last test',
      '🧠 Learning module completed'
    ]);
  
    fetch('http://127.0.0.1:5051/api/gpa-goal')
      .then(res => res.json())
      .then(data => setGpaGoal(data));
  
    fetch('http://127.0.0.1:5051/api/notification-triggers')
      .then(res => res.json())
      .then(data => setTriggers(data));
  }, []);
  

  const dismissNotification = (indexToRemove) => {
    setNotifications((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        padding: '30px',
        gap: '30px',
        alignItems: 'flex-start',
        minHeight: '100vh',
      }}
    >
      {/* Notification Feed */}
      <div style={{ flex: 2 }}>
        <h2 className="section-title">Notifications</h2>
        <div className="notif-feed-scroll">
          <ul className="notif-list">
            {notifications.map((note, index) => (
              <li key={index} className="notification-feed-item hoverable">
                <span className="notif-text">{note}</span>
                <button
                  onClick={() => dismissNotification(index)}
                  className="notif-dismiss"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Settings Summary */}
      <div style={{ flex: 1 }}>
        <div className="summary-box">
          <h4>GPA Goal</h4>
          {gpaGoal ? (
            <p>
              Goal: <strong>{gpaGoal.goal}</strong> — via <strong>{gpaGoal.preference}</strong>
            </p>
          ) : (
            <p>Loading GPA goal...</p>
          )}
          <div style={{ marginTop: '10px', marginLeft: '2px' }}>
            <button onClick={() => goTo('gpa')}>Edit GPA Goal</button>
          </div>
        </div>

        <div className="summary-box">
          <h4>Notification Triggers</h4>
          {triggers ? (
            <ul>
              <li>Low grade alert: {triggers.lowGradeAlert ? ' On' : ' Off'}</li>
              <li>New grade alert: {triggers.newGradeAlert ? ' On' : ' Off'}</li>
              <li>Follow-up alert: {triggers.followUpAlert ? ' On' : ' Off'}</li>
            </ul>
          ) : (
            <p>Loading triggers...</p>
          )}
          <div style={{ marginTop: '10px', marginLeft: '2px' }}>
            <button onClick={() => goTo('triggers')}>Edit Triggers</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotifPage;
