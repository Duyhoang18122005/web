import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // ⚠️ Giả lập đăng ký
    if (email && password && username) {
      alert("Đăng ký thành công!");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>
        <input
          type="text"
          placeholder="Tên người dùng"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full mb-6 px-4 py-2 rounded bg-gray-700 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
