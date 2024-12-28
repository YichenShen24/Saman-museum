const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../data/surveys.json");

// Helper functions for reading and writing data
const readData = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// POST: Submit survey feedback
router.post("/", (req, res) => {
  const { feedback } = req.body;
  if (!feedback)
    return res.status(400).json({ message: "Feedback is required" });

  try {
    const surveys = readData();
    const newSurvey = { feedback, timestamp: new Date().toISOString() };
    surveys.push(newSurvey);
    writeData(surveys);

    // Update keyword frequencies
    const keywords = {};
    surveys.forEach((survey) => {
      const words = survey.feedback
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 1);

      words.forEach((word) => {
        if (!keywords[word]) keywords[word] = 0;
        keywords[word]++;
      });
    });

    // Broadcast updated word cloud to all connected clients
    req.app.get("io").emit("updateWordCloud", keywords);

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error writing feedback:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
