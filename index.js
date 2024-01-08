const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create mongoose schema for your form data
const formDataSchema = new mongoose.Schema({
  studentName: String,
  session: String,
  class: String,
  studentRoll: String,
  studentBloodGrp: String,
  studentImage: String,
});

const FormDataModel = mongoose.model("FormData", formDataSchema);

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// Route to handle form data submission
app.post("/api/saveFormData", async (req, res) => {
  try {
    const formData = req.body;

    // Check if there is already a record with the same values for studentName, session, class, and studentRoll
    const existingEntry = await FormDataModel.findOne({
      studentName: formData.studentName,
      session: formData.session,
      class: formData.class,
      studentRoll: formData.studentRoll,
    });

    if (existingEntry) {
      return res
        .status(400)
        .json({
          error: "Duplicate entry: Student information already exists.",
        });
    }

    // If no duplicate entry, proceed to create a new record
    const savedFormData = await FormDataModel.create(formData);
    res.status(201).json(savedFormData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ? get all student
app.get("/api/getAllStudentInfo", async (req, res) => {
  try {
    const allStudentInfo = await FormDataModel.find();
    res.status(200).json(allStudentInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
