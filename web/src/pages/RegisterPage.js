import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../data/call_api/CallApiLoginRegister';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        name: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const calculatePasswordStrength = (password) => {
        let score = 0;
        let feedback = '';

        if (password.length >= 8) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[a-z]/)) score++;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[^a-zA-Z0-9]/)) score++;

        switch (score) {
            case 0:
            case 1:
                feedback = 'Rất yếu';
                break;
            case 2:
                feedback = 'Yếu';
                break;
            case 3:
                feedback = 'Trung bình';
                break;
            case 4:
                feedback = 'Mạnh';
                break;
            case 5:
                feedback = 'Rất mạnh';
                break;
            default:
                feedback = '';
        }

        return { score, feedback };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Calculate password strength
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

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
        
        // Username validation
        if (!formData.username.trim()) {
            tempErrors.username = 'Tên đăng nhập không được để trống';
            isValid = false;
        } else if (formData.username.length < 3) {
            tempErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            tempErrors.password = 'Mật khẩu không được để trống';
            isValid = false;
        } else if (formData.password.length < 8) {
            tempErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
            isValid = false;
        } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/.test(formData.password)) {
            tempErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ số, 1 chữ thường, 1 chữ hoa và 1 ký tự đặc biệt';
            isValid = false;
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        // Email validation
        if (!formData.email) {
            tempErrors.email = 'Email không được để trống';
            isValid = false;
        } else if (!/^[A-Za-z0-9+_.-]+@(.+)$/.test(formData.email)) {
            tempErrors.email = 'Email không hợp lệ';
            isValid = false;
        }

        // Name validation
        if (!formData.name.trim()) {
            tempErrors.name = 'Họ tên không được để trống';
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
                await registerUser(formData);
                navigate('/login');
            } catch (error) {
                setApiError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength.score) {
            case 0:
            case 1:
                return 'bg-red-500';
            case 2:
                return 'bg-orange-500';
            case 3:
                return 'bg-yellow-500';
            case 4:
                return 'bg-green-500';
            case 5:
                return 'bg-emerald-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
            <div className="relative w-full max-w-md p-8 transform hover:scale-[1.01] transition-all duration-300">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-lg blur"></div>
                
                {/* Main Content */}
                <div className="relative bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                            Đăng Ký
                        </h2>
                        <p className="mt-2 text-gray-400">Tạo tài khoản mới</p>
                    </div>

                    {apiError && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="username"
                                placeholder="Tên đăng nhập"
                                className={`w-full px-4 py-3 bg-gray-800/50 border ${
                                    errors.username ? 'border-red-500' : 'border-gray-700'
                                } rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-100 placeholder-gray-500`}
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Mật khẩu"
                                className={`w-full px-4 py-3 bg-gray-800/50 border ${
                                    errors.password ? 'border-red-500' : 'border-gray-700'
                                } rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-100 placeholder-gray-500`}
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

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Xác nhận mật khẩu"
                                className={`w-full px-4 py-3 bg-gray-800/50 border ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                                } rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-100 placeholder-gray-500`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className={`w-full px-4 py-3 bg-gray-800/50 border ${
                                    errors.email ? 'border-red-500' : 'border-gray-700'
                                } rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-100 placeholder-gray-500`}
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Họ và tên"
                                className={`w-full px-4 py-3 bg-gray-800/50 border ${
                                    errors.name ? 'border-red-500' : 'border-gray-700'
                                } rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-100 placeholder-gray-500`}
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>

                        <div className="mt-6 text-center text-gray-400">
                            <span>Đã có tài khoản? </span>
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

export default RegisterPage;