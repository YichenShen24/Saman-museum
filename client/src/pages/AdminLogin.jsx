import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ setAdminToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/discussion/login`,
        { username, password }
      );
      setAdminToken(response.data.token); // Store the token
      setError("");
      navigate("/"); // Redirect to the discussion board
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-red-300">
      <h1 className="text-3xl font-bold text-red-900 mb-4">Admin Login</h1>
      <div className="w-1/3 p-6 bg-white shadow-lg rounded-lg">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg"
        />
        <button
          onClick={handleLogin}
          className="w-full px-6 py-2 bg-red-600 text-white rounded-lg font-bold"
        >
          Login
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default AdminLogin;
