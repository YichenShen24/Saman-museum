import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import WordCloud from "../components/WordCloud";

const socket = io(`${import.meta.env.VITE_API_BASE_URL}`);

const Survey = () => {
  const [feedback, setFeedback] = useState("");
  const [keywords, setKeywords] = useState({});

  useEffect(() => {
    console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

    // Listen for updates from the server
    socket.on("updateWordCloud", (data) => {
      setKeywords(data);
    });

    return () => {
      socket.off("updateWordCloud");
    };
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/survey`, {
        feedback,
      });
      setFeedback(""); // Clear input after submission
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">Live Word Cloud</h1>
      <div className="w-4/5 lg:w-2/3 p-6 bg-white shadow-lg rounded-lg">
        <textarea
          className="w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Share your thoughts on sex education..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className={`mt-4 px-6 py-2 rounded-lg font-bold ${
            feedback.trim()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
          disabled={!feedback.trim()}
        >
          Submit
        </button>
      </div>
      <div className="mt-8">
        {Object.keys(keywords).length > 0 && <WordCloud data={keywords} />}
      </div>
    </div>
  );
};

export default Survey;
