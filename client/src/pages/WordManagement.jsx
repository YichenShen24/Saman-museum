import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WordManagement = ({ adminToken }) => {
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchKeywords = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/word-management`,
        {
          headers: { token: adminToken },
        }
      );
      setKeywords(response.data);
    } catch (error) {
      console.error("Error fetching keywords:", error);
      setError("Failed to fetch keywords.");
    }
  };

  const deleteKeyword = async (word) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/word-management/${word}`,
        {
          headers: { token: adminToken },
        }
      );
      fetchKeywords();
    } catch (error) {
      console.error("Error deleting keyword:", error);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  if (!adminToken) {
    return (
      <p className="text-red-500 text-center">
        Unauthorized. Please log in as admin.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Word Management</h1>
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Back to Main
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <div className="w-full max-w-4xl">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Word</th>
              <th className="border border-gray-300 px-4 py-2">Frequency</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((keyword) => (
              <tr key={keyword.text}>
                <td className="border border-gray-300 px-4 py-2">
                  {keyword.text}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {keyword.value}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => deleteKeyword(keyword.text)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WordManagement;
