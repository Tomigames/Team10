

// Kunju Menon - sxm22026

const { getUserByEmail, updateUser } = require('../controllers/userController');
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// get user
router.get('/user', getUserByEmail); // GET /user?email=foo@bar.com

// Create user
router.post('/', userController.createUser);

// Update user
router.put('/update', userController.updateUser);


module.exports = router;
