// Backend - GPA Goal Alerts & Notification Triggers Class
const mysql = require('mysql2/promise');

class NotificationSettings {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
  }

  async connect() {
    return mysql.createConnection(this.dbConfig);
  }

  async getGpaAlert(userId) {
    const conn = await this.connect();
    const [rows] = await conn.execute('SELECT * FROM gpa_alerts WHERE user_id = ?', [userId]);
    await conn.end();
    return rows[0] || null;
  }

  async saveGpaAlert(userId, goal, preference) {
    const conn = await this.connect();
    await conn.execute(
      `REPLACE INTO gpa_alerts (user_id, goal, preference) VALUES (?, ?, ?)`,
      [userId, goal, preference]
    );
    await conn.end();
  }

  async getNotificationTriggers(userId) {
    const conn = await this.connect();
    const [rows] = await conn.execute(
      'SELECT * FROM notification_triggers WHERE user_id = ?',
      [userId]
    );
    await conn.end();
    return rows[0] || null;
  }

  async saveNotificationTriggers(userId, triggers) {
    const { lowGradeAlert, newGradeAlert, followUpAlert } = triggers;
    const conn = await this.connect();
    await conn.execute(
      `REPLACE INTO notification_triggers (user_id, lowGradeAlert, newGradeAlert, followUpAlert)
       VALUES (?, ?, ?, ?)`,
      [userId, lowGradeAlert, newGradeAlert, followUpAlert]
    );
    await conn.end();
  }
}

module.exports = NotificationSettings;

