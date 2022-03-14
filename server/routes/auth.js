const express = require('express');
const router = express.Router();
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middelware/authMiddleware');

const { googleCallback } = require('../controllers/googleController');

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// @desc    Authenticate with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google'), googleCallback);

router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const { _id, displayName, firstName, lastName } = req.user;
    res.status(200).send({ _id, displayName, firstName, lastName });
  })
);

module.exports = router;
