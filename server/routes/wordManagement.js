const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../data/surveys.json");

// Helper function to read data
const readData = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

// Helper function to extract keywords and their frequencies
const extractKeywords = () => {
  const data = readData();
  const keywordMap = {};

  // Iterate through all feedback and extract words
  data.forEach((entry) => {
    const feedback = entry.feedback.toLowerCase();
    const words = feedback.match(/\b[a-zA-Z\u4e00-\u9fa5]+\b/g); // Match words and Chinese characters

    if (words) {
      words.forEach((word) => {
        keywordMap[word] = (keywordMap[word] || 0) + 1;
      });
    }
  });

  // Convert map to array
  return Object.entries(keywordMap).map(([text, value]) => ({ text, value }));
};

// GET: Fetch all keywords
router.get("/", (req, res) => {
  try {
    const keywords = extractKeywords();
    res.status(200).json(keywords);
  } catch (error) {
    console.error("Error fetching keywords:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE: Delete a keyword
router.delete("/:word", (req, res) => {
  const { word } = req.params;
  const data = readData();
  const loweredWord = word.toLowerCase();

  // Filter out feedback containing the word
  const filteredData = data.filter(
    (entry) => !entry.feedback.toLowerCase().includes(loweredWord)
  );

  if (filteredData.length === data.length) {
    return res.status(404).json({ message: "Word not found in feedback" });
  }

  fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2));
  res.status(200).json({ message: `Word "${word}" deleted successfully` });
});

// PUT: Update keyword frequency
router.put("/:word", (req, res) => {
  const { word } = req.params;
  const { frequencyChange } = req.body;

  // NOTE: Since frequency is dynamically calculated from feedback, updating frequency
  // would require modifying the underlying feedback, which is not trivial.
  res.status(400).json({
    message: "Frequency updates not supported with current data model",
  });
});

module.exports = router;
