const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const authenticateToken = require("../middleware/authenticateToken");
const checkRole = require("../middleware/checkRole");

// GET all courses
router.get("/", authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find().select("-createdBy"); // Exclude createdBy
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// GET single course
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("createdBy", "email");
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: "Invalid course ID" });
  }
});



// CREATE course (teacher only)
router.post("/", authenticateToken, checkRole("teacher"), async (req, res) => {
  try {
    // Validate required fields
    const { courseName, subjectArea, credits, description } = req.body;
    if (!courseName || !subjectArea || credits === undefined || !description) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["courseName", "subjectArea", "credits", "description"],
      });
    }

    // Create course
    const course = new Course({
      courseName,
      subjectArea,
      credits: Number(credits),
      description,
      createdBy: req.user.id,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error("Course creation error:", err);
    res.status(400).json({
      error: "Failed to create course",
      details: err.message,
    });
  }
});

// UPDATE course (teacher only)
router.put("/:id", authenticateToken, checkRole("teacher"), async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Course not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update course" });
  }
});

// DELETE course (teacher only)
router.delete("/:id", authenticateToken, checkRole("teacher"), async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete course" });
  }
});

module.exports = router;
