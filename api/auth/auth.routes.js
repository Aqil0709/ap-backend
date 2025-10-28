const express = require('express');
const router = express.Router();
// Import all necessary functions from the controller
const {
    registerUser,
    loginUser,
    logoutUser
} = require('./auth.controller'); // Assuming controller is in the same directory

// --- User Registration and Login ---
// Route for user registration: POST /api/auth/register
router.post('/register', registerUser);

// Route for user login: POST /api/auth/login
router.post('/login', loginUser);

// Route for user logout: POST /api/auth/logout
router.post('/logout', logoutUser);

// --- OTP routes removed as they are no longer in the controller ---

module.exports = router;
