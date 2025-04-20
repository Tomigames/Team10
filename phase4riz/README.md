README - GPA Goal Alerts & Notification Triggers
=====================================================

This setup powers two key features for a student grade-tracking system:
1. GPA Goal Alerts
2. Notification Triggers (for grades and performance alerts)

This includes React frontends, Node.js backend with Express, and a MySQL schema.

-----------------------------------------------------
FILE LIST OVERVIEW
-----------------------------------------------------

1. **GpaGoalAlert.js** (Frontend - React)
   - Allows users to set a GPA goal
   - Sends and retrieves data from the backend

2. **NotifTriggers.js** (Frontend - React)
   - Lets users toggle various academic notifications:
     - Grade drops below 70
     - New grade posted
     - Persistent low grade alert

3. **BackendApi.js** (Backend Class - Node.js)
   - Handles database operations using mysql2/promise
   - Methods:
     - getGpaAlert / saveGpaAlert
     - getNotificationTriggers / saveNotificationTriggers

4. **Server.js** (Express server)
   - Provides routes for:
     - GET /api/gpa-goal
     - POST /api/gpa-goal
     - GET /api/notification-triggers
     - POST /api/notification-triggers
   - Connects to `BackendApi.js`

5. **GpaGoalandNotif.sql** (SQL Schema)
   - Creates two tables:

     Table: `gpa_alerts`
     -------------------
     user_id INT PRIMARY KEY
     goal DECIMAL(3,2)
     preference VARCHAR(20)
     created_at TIMESTAMP
     updated_at TIMESTAMP

     Table: `notification_triggers`
     -----------------------------
     user_id INT PRIMARY KEY
     lowGradeAlert BOOLEAN
     newGradeAlert BOOLEAN
     followUpAlert BOOLEAN

-----------------------------------------------------
SETUP STEPS
-----------------------------------------------------

1. Import the schema:
   ```
   mysql -u root -p < GpaGoalandNotif.sql
   ```

2. Install dependencies:
   ```
   npm install express mysql2 cors body-parser
   ```

3. Run the backend:
   ```
   node Server.js
   ```

4. Place React components (`GpaGoalAlert.js`, `NotifTriggers.js`) in your React app and connect them via Axios to:
   - http://localhost:5000/api/gpa-goal
   - http://localhost:5000/api/notification-triggers

-----------------------------------------------------
NOTES
-----------------------------------------------------
- Currently uses static `user_id = 1` for demo purposes. Replace with actual user session handling in production.
- Ensure MySQL is running and credentials in `BackendApi.js` match your environment.
- React components should be styled or placed in appropriate routes/pages.