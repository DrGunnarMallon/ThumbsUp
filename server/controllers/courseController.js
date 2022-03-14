const asyncHandler = require('express-async-handler');

const Course = require('../models/Course');
const User = require('../models/User');
const { googleCallback } = require('./googleController');

// @desc    Get all courses for user
// @route   get /course
// @access  Protected
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ user: req.user.id });
  res.status(200).json(courses);
});

// @desc    Add a courses for user
// @route   post /course
// @access  Protected
const setCourse = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400).send('Please add a title field');
  }

  const course = await Course.create({
    user: req.user.id,
    name: req.body.title,
  });

  res.status(200).json(course);
});

// @desc    Add a courses for user
// @route   post /course/:id
// @access  Protected
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.status(200).json(course);
  }
  res.status(400).json({ message: 'Course not found', error: true });
});

// @desc    Update a courses for user
// @route   update /course/:id
// @access  Protected
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    const user = await User.findById(req.user.id);

    // Check for user
    if (!user) {
      res.status(401).send('User not found');
    }

    // Check that correct user is logged in
    if (course.user.toString !== user.id) {
      res.status(401).send('User not authorised');
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCourse);
  }

  res.status(400).json({ message: 'Course could not be updated', error: true });
});

// @desc    Delete a user courses
// @route   delete /course/:id
// @access  Protected
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  // Check if course exists
  if (!course) {
    res.status(400).send('Course could not be deleted');
  } else {
    // Get the user by id
    const user = await User.findById(req.user.id);

    // Check for user
    if (!user) {
      res.status(401).send('User not found');
    }

    console.log(`Course user: ${course.user.toString()} / User id: ${user.id}`);

    // Check that correct user is logged in
    if (course.user.toString() !== user.id) {
      res.status(401).send('User not authorised');
    }

    await course.remove();

    res.status(200).json({ id: req.params.id });
  }
});

module.exports = { getCourses, getCourse, setCourse, deleteCourse, updateCourse };
