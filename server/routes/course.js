const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  deleteCourse,
  setCourse,
  updateCourse,
} = require('../controllers/courseController');

const { protect } = require('../middelware/authMiddleware');

router.route('/').get(protect, getCourses).post(protect, setCourse);
router
  .route('/:id')
  .get(protect, getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
