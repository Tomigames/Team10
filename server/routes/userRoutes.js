

// Kunju Menon - sxm22026

const { getUserByEmail, updateUser } = require('../controllers/userController');
const express = require('express');
const userController = require('../controllers/userController');
const db = require('../config/db');

const router = express.Router();

// get user
router.get('/user', getUserByEmail); // GET /user?email=foo@bar.com

// Create user
router.post('/', userController.createUser);

// Update user
router.put('/update', userController.updateUser);

// Rizvy Rahman-Danish axr210167
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const [rows] = await db.query('SELECT USERID AS id, password FROM user WHERE username = ?', [username]);
      if (rows.length === 0) return res.status(401).json({ error: 'Invalid username' });
  
      const user = rows[0];
      if (user.password !== password) return res.status(401).json({ error: 'Invalid password' });
  
      res.json({ userId: user.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/signup', async (req, res) => {
    const { first_name, last_name, email, phone, username, password } = req.body;

    try {
        await db.query(
            'INSERT INTO user (FirstName, LastName, Email, PhoneNumber, username, password) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone, username, password]
        );
        res.json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Signup error:',err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Username already exists' });
        } else {
            res.status(500).json({ error: 'Signup failed', details: err.message });
        }
    }
});

module.exports = router;
