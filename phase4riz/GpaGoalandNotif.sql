
CREATE DATABASE IF NOT EXISTS gradeview;
USE gradeview;

-- GPA Goal Alerts Table
CREATE TABLE IF NOT EXISTS gpa_alerts (
  user_id INT PRIMARY KEY,
  goal DECIMAL(3,2),
  preference VARCHAR(20)
);

-- Notification Triggers Table
CREATE TABLE IF NOT EXISTS notification_triggers (
  user_id INT PRIMARY KEY,
  lowGradeAlert BOOLEAN,
  newGradeAlert BOOLEAN,
  followUpAlert BOOLEAN
);

