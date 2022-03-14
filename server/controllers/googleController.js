const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const googleCallback = asyncHandler(async (req, res) => {
  if (req.isAuthenticated()) {
    const { firstName, _id: id, lastName, image, displayName } = req.user;

    let user = await User.findOne({ _id: id });
    if (user) {
      res.status(201).json({
        displayName: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).send('Invalid user data');
    }
  } else {
    res.status(400).send('Could not authenticate the user');
  }
});

// Generate JWT
const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  return token;
};

module.exports = {
  googleCallback,
};
