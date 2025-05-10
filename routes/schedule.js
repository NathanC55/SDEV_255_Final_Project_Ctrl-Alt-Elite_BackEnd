const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const { authenticateToken } = require("../middleware/authMiddleware");

// Add course to schedule
router.post("/add/:courseId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // Avoid duplicates
    if (user.schedule.includes(course._id)) {
      return res.status(400).json({ message: "Course already added" });
    }

    user.schedule.push(course._id);
    await user.save();
    res.json({ message: "Course added to schedule", schedule: user.schedule });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Drop course from schedule
router.delete("/remove/:courseId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.schedule = user.schedule.filter((courseId) => courseId.toString() !== req.params.courseId);
    await user.save();
    res.json({ message: "Course removed from schedule", schedule: user.schedule });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student's schedule
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("schedule");
    res.json(user.schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
