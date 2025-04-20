// ✅ Confirm you're running the right file
console.log("✅ This is the right Server.js file");

const express = require('express');
const cors = require('cors');
const NotificationSettingsClass = require('./BackendApi');

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

// ✅ Log every incoming request
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url}`);
  next();
});

// ✅ MySQL Config
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Kansas@2309',
  database: 'gradeview'
};

const settingsManager = new NotificationSettingsClass(dbConfig);

// ✅ TEST ROUTE
app.post('/test', (req, res) => {
  console.log("📥 TEST POST route hit");
  console.log("BODY:", req.body);
  res.send("Test POST received");
});

// GPA Goal - GET
app.get('/api/gpa-goal', async (req, res) => {
  const userId = 1;
  try {
    const data = await settingsManager.getGpaAlert(userId);
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching GPA goal:", err);
    res.status(500).json({ error: 'Failed to fetch GPA goal settings' });
  }
});

// GPA Goal - POST
app.post('/api/gpa-goal', async (req, res) => {
  const userId = 1;
  console.log("📥 Reached GPA POST route");
  console.log("Request body:", req.body);

  const { goal, preference } = req.body;

  try {
    await settingsManager.saveGpaAlert(userId, goal, preference);
    console.log("✅ GPA goal saved to DB.");
    res.json({ message: 'GPA goal saved successfully' });
  } catch (err) {
    console.error("❌ Error saving GPA goal:", err);
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
    console.error("❌ Error fetching triggers:", err);
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// Notification Triggers - POST
app.post('/api/notification-triggers', async (req, res) => {
  const userId = 1;
  const { lowGradeAlert, newGradeAlert, followUpAlert } = req.body;

  console.log("📥 Incoming Notification POST:", req.body);

  try {
    await settingsManager.saveNotificationTriggers(userId, {
      lowGradeAlert,
      newGradeAlert,
      followUpAlert
    });
    console.log("✅ Notification settings saved to DB.");
    res.json({ message: 'Notification settings updated' });
  } catch (err) {
    console.error("❌ Error saving triggers:", err);
    res.status(500).json({ error: 'Failed to save notification preferences' });
  }
});

app.post('/ping', (req, res) => {
  console.log("📡 Received POST to /ping");
  res.send("pong");
});


// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Failed to bind server:', err);
});

