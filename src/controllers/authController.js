const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Token = require('../models/Token'); 


exports.register = async (req, res) => {
  const { fullName, username, email, password, role = 'user' } = req.body;

  try {
    // Check if the email is already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the role
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      role,
      isActive: true
    });

    await newUser.save();

    res.status(201).json({

      status: 201,
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive
      }
    });
  } catch (error) {
    // Handle MongoDB duplicate key errors separately
    if (error.name === 'MongoError' && error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different ${field}.`;
      return res.status(409).json({
        message: message
      });
    }

    // General error handling
    res.status(500).json({
      message: 'Failed to register user',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        status: 401,
        message: 'Autentikasi gagal: Pengguna tidak ditemukan',
        error: 'Email atau password tidak valid'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        status: 401,
        message: 'Autentikasi gagal: Password salah',
        error: 'Email atau password tidak valid'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: 403, 
        message: 'Account is not active, please contact administrator' });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: user.username
      },
      process.env.JWT_KEY_SECRET,
      { expiresIn: '24h' }
    );

    // Check for existing token in the database
    let tokenRecord = await Token.findOne({ userId: user._id });
    if (tokenRecord) {
      tokenRecord.accessCount += 1;  // Increment access count each time user logs in
      tokenRecord.token = token;  // Update token in the record
    } else {
      // Create a new token record if it does not exist
      tokenRecord = new Token({
        userId: user._id,
        token: token,
        accessCount: 1
      });
    }
    await tokenRecord.save();

    // Send the token and user details in response
    res.json({
      status: 200,
      message: 'Login successful',
      data: {
        token: `${tokenRecord.accessCount}|${token}`,  // Prepend access count to token
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};
