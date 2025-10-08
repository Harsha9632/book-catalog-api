const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed });

    const message = ' Created with user details';

    
    res.setHeader('X-Status-Message', message);

    const payload = {
      message,
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    };

    console.log('Register response payload:', payload); 

    return res.status(201).json(payload);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    const message = 'OK with JWT token';
    res.setHeader('X-Status-Message', message);

    const payload = { message, success: true, token };

    console.log('Login response payload:', payload);

    return res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};



