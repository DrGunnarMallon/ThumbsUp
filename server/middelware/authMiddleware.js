const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log(decoded);
      console.log(`Decoded id: ${decoded.id}`);

      // Get user id from token
      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      res.status(401).send('Not authorised');
    }
  }

  if (!token) {
    res.status(401).send('Not authorized, no token');
  }
});

module.exports = { protect };
