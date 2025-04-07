// Express Server for GPA Goal Alerts & Notification Triggers
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const NotificationSettings = require('./Backend Api Sql'); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Configure MySQL connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'gradeview'
};

const settingsManager = new NotificationSettings(dbConfig);

// GPA Goal - GET
app.get('/api/gpa-goal', async (req, res) => {
  const userId = 1; // Replace with session-based user ID
  try {
    const data = await settingsManager.getGpaAlert(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch GPA goal settings' });
  }
});

// GPA Goal - POST
app.post('/api/gpa-goal', async (req, res) => {
  const userId = 1;
  const { goal, preference } = req.body;
  try {
    await settingsManager.saveGpaAlert(userId, goal, preference);
    res.json({ message: 'GPA goal saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save GPA goal settings' });
  }
});

// Notification Triggers - GET
app.get('/api/notification-triggers', async (req, res) => {
  const userId = 1;
  try {
    const data = await settingsManager.getNotificationTriggers(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// Notification Triggers - POST
app.post('/api/notification-triggers', async (req, res) => {
  const userId = 1;
  const { lowGradeAlert, newGradeAlert, followUpAlert } = req.body;
  try {
    await settingsManager.saveNotificationTriggers(userId, {
      lowGradeAlert,
      newGradeAlert,
      followUpAlert
    });
    res.json({ message: 'Notification settings updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save notification preferences' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
