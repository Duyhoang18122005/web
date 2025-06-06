import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Layout/Header";
import HomePage from "../pages/HomePage";
import BookingPage from "../pages/BookingPage";
import BookingSuccess from "../pages/BookingSuccess";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Profile from "../components/Profiles/Profile";

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header luôn hiển thị */}
      <Header
        isLoggedIn={!!username}
        username={username}
        onLogout={() => {
          localStorage.removeItem("username");
          setUsername("");
        }}
      />

      {/* Nội dung trang thay đổi theo Route */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking/:gamerId" element={<BookingPage />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route path="/login" element={<LoginPage setUsername={setUsername} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/:gamerId" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
