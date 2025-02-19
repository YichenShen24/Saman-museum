import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Discussion from "./pages/Discussion";
import Survey from "./pages/Survey";
import Header from "./components/Header";
import WordManagement from "./pages/WordManagement";
const App = () => {
  const [adminToken, setAdminToken] = useState(null);
  console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

  return (
    <Router>
      {/* 外层容器，确保背景覆盖整个页面 */}
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col">
        {/* Header 部分 */}
        <Header adminToken={adminToken} setAdminToken={setAdminToken} />

        {/* 路由页面部分 */}
        <div className="flex-grow">
          <Routes>
            <Route
              path="/admin"
              element={<AdminLogin setAdminToken={setAdminToken} />}
            />
            <Route
              path="/discussion"
              element={<Discussion adminToken={adminToken} />}
            />
            <Route path="/" element={<Survey />} />
            <Route
              path="/admin/word-management"
              element={<WordManagement adminToken={adminToken} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
