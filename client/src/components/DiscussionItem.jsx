import React, { useState } from "react";
import axios from "axios";

const DiscussionItem = ({
  discussion,
  adminToken,
  fetchDiscussions,
  level = 0,
  maxDepth = 1,
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/discussion/${
          discussion.id
        }/replies`,
        {
          author: "Anonymous", // 或从输入框获取
          content: replyContent,
        }
      );
      setReplyContent("");
      fetchDiscussions(); // 刷新讨论列表
      console.log("Reply added:", response.data.reply); // 调试：查看返回的 parentId
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (level === 0) {
        // 删除主讨论
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/${discussion.id}`,
          {
            headers: { token: adminToken },
          }
        );
      } else {
        // 删除嵌套回复
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/${
            discussion.parentId
          }/replies/${discussion.id}`,
          { headers: { token: adminToken } }
        );
      }
      fetchDiscussions();
    } catch (error) {
      console.error("Error deleting discussion or reply:", error);
    }
  };

  return (
    <div
      className={`mb-4 shadow-md rounded-lg p-4 ${
        level === 0 ? "bg-blue-50" : "bg-green-50"
      }`}
      style={{ marginLeft: `${level * 20}px` }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-gray-700">
            {discussion.author}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(discussion.timestamp).toLocaleString()}
          </p>
        </div>
        {adminToken && (
          <button
            onClick={handleDelete}
            className="text-red-500 text-sm hover:underline"
          >
            Delete
          </button>
        )}
      </div>

      {/* Content */}
      <p className="mt-2 text-gray-800">{discussion.content}</p>

      {/* Collapse/Expand Button */}
      {discussion.replies && discussion.replies.length > 0 && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-4 text-blue-500 text-sm hover:underline"
        >
          {isCollapsed ? "Expand Replies" : "Collapse Replies"}
        </button>
      )}

      {/* Inline Reply Form */}
      {!isCollapsed && level < maxDepth && (
        <div className="mt-4">
          <textarea
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
          <button
            onClick={handleReply}
            className={`mt-2 px-4 py-2 text-sm font-semibold text-white rounded-md ${
              replyContent.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!replyContent.trim()}
          >
            Reply
          </button>
        </div>
      )}

      {/* Nested Replies */}
      {!isCollapsed && discussion.replies && discussion.replies.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200">
          {discussion.replies.map((reply) => (
            <DiscussionItem
              key={reply.id}
              discussion={reply}
              adminToken={adminToken}
              fetchDiscussions={fetchDiscussions}
              level={level + 1} // Increment level
              maxDepth={maxDepth} // Pass maxDepth to child
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionItem;
