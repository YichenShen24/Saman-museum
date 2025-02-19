import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ adminToken, setAdminToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAdminToken(null); // 清除管理员 Token
    navigate("/"); // 重定向到首页
  };

  return (
    <header className="bg-blue-600 text-white py-4 px-8 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 左侧导航链接 */}
        <div className="flex space-x-4">
          <Link
            to="/"
            className="hover:underline hover:text-gray-100 text-lg font-semibold text-white"
          >
            Word Cloud
          </Link>

          <Link
            to="/discussion"
            className="hover:underline hover:text-gray-100 text-lg font-semibold text-white"
          >
            Discussion Board
          </Link>
          {/* 管理页面链接，仅在管理员登录时显示 */}
          {adminToken && (
            <Link
              to="/admin/word-management"
              className="hover:underline hover:text-gray-100 text-lg font-semibold text-white"
            >
              Word Management
            </Link>
          )}
        </div>

        {/* 右侧 Admin Login/Logout */}
        <div>
          {adminToken ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/admin"
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
