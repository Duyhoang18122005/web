import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', formData);
      setMessage('Nếu thông tin chính xác, một liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="relative w-full max-w-md p-8 transform hover:scale-[1.01] transition-all duration-300">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-lg blur"></div>
        
        {/* Main Content */}
        <div className="relative bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Quên mật khẩu
            </h2>
            <p className="mt-2 text-gray-400">Nhập tên đăng nhập và email của bạn để nhận liên kết đặt lại mật khẩu</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-100 placeholder-gray-500"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-100 placeholder-gray-500"
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg 
                ${!loading && 'hover:from-purple-600 hover:to-blue-600'} 
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                focus:ring-offset-gray-900 transition-all duration-200 transform 
                ${!loading && 'hover:scale-[1.02]'}
                ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </div>
              ) : (
                'Gửi liên kết đặt lại mật khẩu'
              )}
            </button>

            <div className="mt-6 text-center text-gray-400">
              <span>Đã nhớ mật khẩu? </span>
              <a
                href="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Đăng nhập
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 