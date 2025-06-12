import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Layout/Header";
import Profile from "../components/Profiles/Profile";
import BookingPage from "../pages/BookingPage";
import BookingSuccess from "../pages/BookingSuccess";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboards from "./admin/Dashboard";
import ManageGame from './admin/ManageGame';
import TransactionHistory from './admin/TransactionHistory';
import UserManagement from './admin/UserManagement';

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
        <Route path="/dashboard" element={<Dashboards />} />
        <Route path="/managegame" element={<ManageGame />} />
        <Route path="/transaction" element={<TransactionHistory />} />
        <Route path="/UserManagement" element={<UserManagement />} />
      </Routes>
    </div>
  );
}

export default App;
