//required imports
const express = require("express");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
var cors = require("cors");

//activate server
const app = express();
app.use(cors());
const router = express.Router();
app.use("/api", router);
app.listen(3000);

//connect to mongoDB
mongoose
  .connect(
    "mongodb+srv://FPAdmin:Y8imOPz5a0wHIwBQ@fpcluster1.5h639vi.mongodb.net/School?retryWrites=true&w=majority&appName=FPCluster1",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

//define Mongoose Schema
const courseSchema = new Schema({
  courseName: { type: String, required: true },
  description: { type: String, required: true },
  subjectArea: { type: String, required: true },
  credits: { type: Number, required: true, min: 1, max: 3 },
});

const Course = model("Course", courseSchema);

//create new course
// const newCourse = new Course({
//     courseName: "English 101",
//     description: "Introduction to College-level writing.",
//     subjectArea: "English",
//     credits: 3
// });

// newCourse.save()
//     .then(doc => {
//     console.log("New course created:", doc);
//     })
//     .catch(err => {
//     console.error("Error creating course:", err);
//     });

//grab all db courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.send(courses);
    console.log(courses);
  } catch (err) {
    console.log(err);
  }
});

// grab single course
router.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (err) {
    res.status(400).send(err);
  }
});

//create a course
router.post("/courses", async (req, res) => {
  try {
    const course = await new Course(req.body);
    await course.save();
    res.status(201).json(course);
    console.log(course);
  } catch (err) {
    res.status(400).send(err);
  }
});

//update uses a put request
router.put("/courses/:id", async (req, res) => {
  //to find song, request the id, then search for it
  try {
    const course = req.body;
    await Course.updateOne({ _id: req.params.id }, course);
    console.log(course);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/courses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (deletedCourse) {
      res.status(200).send({ message: "Course deleted" });
    } else {
      res.status(404).send({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).send({ message: "Server error" });
  }
});

//make api using routes
//routes handle browser requests but look like URLs. Functions are used to dynamically handle routes

// GET /courses — fetch all courses
// router.get("/courses", async (req, res) => {
//     try {
//         const courses = await Course.find();
//         res.json(courses);
//         } catch (err) {
//             console.error("Error fetching courses:", err);
//             res.status(500).json({ error: "Failed to fetch courses" });
//         }
// });
