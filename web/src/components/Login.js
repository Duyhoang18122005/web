import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../data/call_api/CallApiLoginRegister';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ setUsername }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);

    // Check for saved credentials
    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            setFormData(prev => ({
                ...prev,
                username: savedUsername,
                rememberMe: true
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prevState => ({
                ...prevState,
                [name]: ''
            }));
        }
        if (apiError) {
            setApiError('');
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.username.trim()) {
            tempErrors.username = 'Tên đăng nhập không được để trống';
            isValid = false;
        }

        if (!formData.password) {
            tempErrors.password = 'Mật khẩu không được để trống';
            isValid = false;
        } else if (formData.password.length < 8) {
            tempErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            setApiError('');
            try {
                const response = await loginUser({
                    username: formData.username,
                    password: formData.password
                });
                
                if (response.username) {
                    // Handle "Remember me"
                    if (formData.rememberMe) {
                        localStorage.setItem('rememberedUsername', formData.username);
                    } else {
                        localStorage.removeItem('rememberedUsername');
                    }

                    setUsername(response.username);
                    setLoginAttempts(0);
                    navigate('/');
                }
            } catch (error) {
                setLoginAttempts(prev => prev + 1);
                setApiError(
                    loginAttempts >= 2 
                        ? 'Nhiều lần đăng nhập thất bại. Bạn có thể thử lại sau hoặc đặt lại mật khẩu.'
                        : error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
                );
            } finally {
                setIsLoading(false);
            }
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
                            Đăng Nhập
                        </h2>
                        <p className="mt-2 text-gray-400">Chào mừng bạn trở lại!</p>
                    </div>

                    {apiError && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                            {apiError}
                            {loginAttempts >= 2 && (
                                <div className="mt-2">
                                    <a href="/forgot-password" className="text-purple-400 hover:text-purple-300 underline">
                                        Quên mật khẩu?
                                    </a>
                                </div>
                            )}
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
                                    className={`w-full px-4 py-3 bg-gray-800/50 border ${
                                        errors.username ? 'border-red-500' : 'border-gray-700'
                                    } rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-100 placeholder-gray-500`}
                                    placeholder="Tên đăng nhập"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-100 placeholder-gray-500"
                                    placeholder="Mật khẩu"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                                />
                                <label htmlFor="rememberMe" className="ml-2 text-gray-400">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <a href="/forgot-password" className="text-purple-400 hover:text-purple-300 transition-colors">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className={`w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg 
                                ${!isLoading && 'hover:from-purple-600 hover:to-blue-600'} 
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                                focus:ring-offset-gray-900 transition-all duration-200 transform 
                                ${!isLoading && 'hover:scale-[1.02]'}
                                ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang đăng nhập...
                                </div>
                            ) : (
                                'Đăng Nhập'
                            )}
                        </button>

                        <div className="mt-6 text-center text-gray-400">
                            <span>Chưa có tài khoản? </span>
                            <a
                                href="/register"
                                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                            >
                                Đăng ký ngay
                            </a>
                        </div>
                    </form>

                    {/* Social Login Options */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-400">Hoặc đăng nhập với</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button 
                                className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                                disabled={isLoading}
                                onClick={() => alert('Tính năng đang được phát triển')}
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                                <span className="text-sm text-gray-300">Google</span>
                            </button>
                            <button 
                                className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                                disabled={isLoading}
                                onClick={() => alert('Tính năng đang được phát triển')}
                            >
                                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="h-5 w-5 mr-2" />
                                <span className="text-sm text-gray-300">Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 