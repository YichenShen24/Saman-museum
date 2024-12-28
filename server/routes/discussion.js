const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../data/discussions.json");

// Helper functions
const readData = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET all discussions
router.get("/", (req, res) => {
  try {
    const discussions = readData();
    res.status(200).json(discussions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// POST a new discussion
router.post("/", (req, res) => {
  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ message: "Author and content are required" });
  }

  try {
    const discussions = readData();
    const newDiscussion = {
      id: Date.now().toString(),
      author,
      content,
      timestamp: new Date().toISOString(),
    };
    discussions.push(newDiscussion);
    writeData(discussions);
    res.status(201).json({
      message: "Discussion added successfully",
      discussion: newDiscussion,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Mock admin credentials
const adminCredentials = {
  username: "admin",
  password: "password123", // You can hash this for better security
};

let adminToken = null; // Mock token storage

// POST: Admin login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    adminToken = Date.now().toString(); // Generate a simple token
    return res
      .status(200)
      .json({ message: "Login successful", token: adminToken });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// DELETE: Delete a discussion by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { token } = req.headers;

  if (token !== adminToken) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const discussions = readData();
    const filteredDiscussions = discussions.filter(
      (discussion) => discussion.id !== id
    );
    if (discussions.length === filteredDiscussions.length) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    writeData(filteredDiscussions);
    res.status(200).json({ message: "Discussion deleted successfully" });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// POST: Add a reply to a discussion
router.post("/:id/replies", (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  if (!author || !content) {
    return res.status(400).json({ message: "Author and content are required" });
  }

  try {
    const discussions = readData();
    const discussion = discussions.find((d) => d.id === id);

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    const newReply = {
      id: Date.now().toString(),
      author,
      content,
      timestamp: new Date().toISOString(),
      parentId: id, // 在后端生成 parentId
    };

    if (!discussion.replies) {
      discussion.replies = [];
    }
    discussion.replies.push(newReply);
    writeData(discussions);

    res
      .status(201)
      .json({ message: "Reply added successfully", reply: newReply });
  } catch (error) {
    console.error("Error adding reply:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
router.delete("/:id/replies/:replyId", (req, res) => {
  const { id, replyId } = req.params; // 讨论ID和回复ID
  const { token } = req.headers;

  console.log("DELETING REPLY", { id, replyId }); // 调试日志

  // 验证管理员Token
  if (token !== adminToken) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const discussions = readData();

    // 查找目标讨论
    const discussion = discussions.find((d) => d.id === id);
    if (!discussion || !discussion.replies) {
      return res.status(404).json({ message: "Discussion or reply not found" });
    }

    // 查找并删除目标回复
    const replyIndex = discussion.replies.findIndex(
      (reply) => reply.id === replyId
    );
    if (replyIndex === -1) {
      return res.status(404).json({ message: "Reply not found" });
    }

    discussion.replies.splice(replyIndex, 1); // 删除回复

    // 如果删除成功，更新数据存储
    writeData(discussions);
    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    console.error("Error deleting reply:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
