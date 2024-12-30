const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const surveyRoutes = require("./routes/survey");
const discussionRoutes = require("./routes/discussion"); // 确保路径正确
const wordManagementRoutes = require("./routes/wordManagement"); // 添加 Word Management 路由

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Attach io to app for broadcasting
app.set("io", io);

app.use(cors());
app.use(bodyParser.json());
app.use("/api/survey", surveyRoutes);
app.use("/api/discussion", discussionRoutes);
app.use("/api/word-management", wordManagementRoutes); // 注册路由

// const PORT = process.env.PORT || 5002;
const PORT = 5002;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
