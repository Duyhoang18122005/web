import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setUsername }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      const mockUsername = "StreamQueen";
      localStorage.setItem("token", "fake-token");
      localStorage.setItem("username", mockUsername);
      setUsername(mockUsername);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full mb-6 px-4 py-2 rounded bg-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded font-bold"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
