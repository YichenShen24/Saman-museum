import React, { useState, useEffect } from "react";
import axios from "axios";
import DiscussionItem from "../components/DiscussionItem";

const Discussion = ({ adminToken }) => {
  const [discussions, setDiscussions] = useState([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  // 添加 parentId 给每个回复
  const addParentIdToReplies = (discussion, parentId) => {
    if (discussion.replies && discussion.replies.length > 0) {
      discussion.replies = discussion.replies.map((reply) => ({
        ...reply,
        parentId, // 添加 parentId 字段
      }));
      discussion.replies.forEach((reply) =>
        addParentIdToReplies(reply, discussion.id)
      );
    }
  };

  // 加载讨论数据并添加 parentId
  const fetchDiscussionsWithParentId = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/discussion");
      const data = response.data;

      data.forEach((discussion) => {
        console.log("Discussion:", discussion);
        if (discussion.replies) {
          discussion.replies.forEach((reply) =>
            console.log("Reply with parentId:", reply)
          );
        }
      });
      setDiscussions(data);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  // 提交新讨论
  const handleSubmit = async () => {
    if (!author.trim() || !content.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5002/api/discussion",
        {
          author,
          content,
        }
      );
      setAuthor("");
      setContent("");
      fetchDiscussionsWithParentId(); // 重新加载讨论
    } catch (error) {
      console.error("Error submitting discussion:", error);
    }
  };

  // 初始化加载讨论数据
  useEffect(() => {
    fetchDiscussionsWithParentId();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Discussion Board
        </h1>

        {/* 添加新讨论 */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Start a Discussion
          </h2>
          <input
            type="text"
            placeholder="Your Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full mb-4 p-3 border rounded-md text-sm"
          />
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-md text-sm"
          />
          <button
            onClick={handleSubmit}
            className={`mt-4 w-full py-2 text-white font-semibold rounded-md ${
              author.trim() && content.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!author.trim() || !content.trim()}
          >
            Post
          </button>
        </div>

        {/* 渲染讨论列表 */}
        <div>
          {discussions.map((discussion) => (
            <DiscussionItem
              key={discussion.id}
              discussion={discussion}
              adminToken={adminToken}
              fetchDiscussions={fetchDiscussionsWithParentId} // 传递刷新方法
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discussion;
