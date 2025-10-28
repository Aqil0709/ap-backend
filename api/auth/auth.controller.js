const User = require('../../models/user.model'); // <-- IMPORT the User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// 'node-fetch' is no longer needed as we removed the OTP API calls

// --- Register User ---
const registerUser = async (req, res) => {
    const { mobileNumber, password, fullName } = req.body;

    if (!mobileNumber || !password || !fullName) {
        return res.status(400).json({ message: 'Mobile number, password, and full name are required.' });
    }

    try {
        // MONGO: Check if user already exists
        const userExists = await User.findOne({ mobileNumber });
        if (userExists) {
            return res.status(409).json({ message: 'User with this mobile number already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // MONGO: Create and save the new user
        const user = await User.create({
            name: fullName,
            mobileNumber,
            password: hashedPassword,
        });

        // MONGO: Mongoose returns the created user document, so we can use its properties
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Use user._id from MongoDB
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            mobileNumber: user.mobileNumber,
            role: user.role,
            token: token,
            message: 'Registration successful.'
        });

    } catch (error)
        {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// --- Login User ---
const loginUser = async (req, res) => {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
        return res.status(400).json({ message: 'Mobile number and password are required.' });
    }

    try {
        // MONGO: Find the user by mobile number
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Use user._id from MongoDB
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(200).json({
TA         _id: user._id,
            name: user.name,
            mobileNumber: user.mobileNumber,
            role: user.role,
            token: token,
            message: 'Login successful.'
        });

    } catch (error)
        {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// --- Logout User (No database interaction, no changes needed) ---
const logoutUser = (req, res) => {
    res.status(200).json({ message: 'Logout successful.' });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
