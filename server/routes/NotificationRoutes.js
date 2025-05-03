// Kunju Menon - sxm22026

const express = require('express');
const pool = require('../config/db'); // Assuming you use a shared db config
const router = express.Router();

// Get user's notification settings (e.g., GPA goal)
router.get('/:userId/settings', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM notifications WHERE UserID = ?',
      [req.params.userId]
    );
    res.json(rows[0] || {}); // Return the first setting or an empty object if not found
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user's GPA goal notification setting
router.put('/:userId/settings', async (req, res) => {
  const { gpaGoal, enableNotifications } = req.body;
  try {
    // Update notification settings in db
    const [result] = await pool.execute(
      'UPDATE notifications SET GPA_Goal = ?, EnableNotifications = ? WHERE UserID = ?',
      [gpaGoal, enableNotifications, req.params.userId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Notification settings updated successfully.' });
    } else {
      res.status(404).json({ error: 'User not found or settings not updated.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add other settings for notifications (if any)
router.post('/:userId/settings', async (req, res) => {
  const { gpaGoal, enableNotifications } = req.body;
  try {
    // Insert new notification settings for the user
    const [result] = await pool.execute(
      'INSERT INTO notifications (UserID, GPA_Goal, EnableNotifications) VALUES (?, ?, ?)',
      [req.params.userId, gpaGoal, enableNotifications]
    );

    res.status(201).json({ message: 'Notification settings created successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
