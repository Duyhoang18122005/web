import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/auth';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Important for CORS with credentials
});

// Add axios interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        // Don't add token for login and register endpoints
        if (config.url === '/login' || config.url === '/register') {
            return config;
        }
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle responses and token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await api.post('/refresh-token', {
                    refreshToken: refreshToken
                });

                if (response.data) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('refreshToken', response.data.refreshToken);

                    // Update the failed request's Authorization header
                    originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                    
                    // Retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh token fails, logout user
                await logoutUser();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle specific error cases
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    return Promise.reject(new Error(error.response.data || 'Dữ liệu không hợp lệ'));
                case 401:
                    // Clear stored tokens and user data if unauthorized
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    return Promise.reject(new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'));
                case 403:
                    return Promise.reject(new Error('Bạn không có quyền thực hiện thao tác này'));
                case 404:
                    return Promise.reject(new Error('Không tìm thấy tài nguyên yêu cầu'));
                case 409:
                    return Promise.reject(new Error('Dữ liệu đã tồn tại trong hệ thống'));
                case 500:
                    return Promise.reject(new Error('Lỗi hệ thống. Vui lòng thử lại sau.'));
                default:
                    return Promise.reject(new Error('Có lỗi xảy ra. Vui lòng thử lại.'));
            }
        }
        
        return Promise.reject(error);
    }
);

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/login', {
            username: credentials.username,
            password: credentials.password
        });
        
        if (response.data) {
            // Store tokens and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                username: response.data.username,
                email: response.data.email,
                roles: response.data.roles,
                coin: response.data.coin
            }));
            if (response.data.userId || response.data.id) {
                localStorage.setItem('userId', response.data.userId || response.data.id);
            }
            // Set default Authorization header for future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            
            return response.data;
        }
        throw new Error('Đăng nhập thất bại');
    } catch (error) {
        if (error.response?.data) {
            throw new Error(error.response.data);
        }
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const registerData = {
            username: userData.username,
            password: userData.password,
            email: userData.email,
            fullName: userData.name,
            dateOfBirth: null,
            phoneNumber: userData.phoneNumber || null,
            address: userData.address || null,
            gender: userData.gender || null
        };

        const response = await api.post('/register', registerData);
        
        if (response.data?.message) {
            return response.data;
        }
        throw new Error('Đăng ký thất bại');
    } catch (error) {
        if (error.response?.data) {
            throw new Error(error.response.data);
        }
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            await api.post('/logout', null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Always clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
    }
};

export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post('/refresh-token', {
            refreshToken: refreshToken
        });

        if (response.data) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            return response.data;
        }
        throw new Error('Token refresh failed');
    } catch (error) {
        await logoutUser();
        throw error;
    }
};

// Function to check if the current token is expired
export const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expirationTime;
    } catch (error) {
        console.error('Error parsing token:', error);
        return true;
    }
};

// Function to validate token and refresh if needed
export const validateSession = async () => {
    if (isTokenExpired()) {
        try {
            await refreshToken();
            return true;
        } catch (error) {
            return false;
        }
    }
    return true;
};

export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put('/update', profileData);
        return response.data;
    } catch (error) {
        if (error.response?.data) {
            throw new Error(error.response.data);
        }
        throw error;
    }
};

const Login = ({ setUsername }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userIdentifier: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
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
        if (!formData.userIdentifier.trim()) {
            tempErrors.userIdentifier = 'Vui lòng nhập tên tài khoản hoặc email';
        }
        if (!formData.password) {
            tempErrors.password = 'Vui lòng nhập mật khẩu';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            setApiError('');
            try {
                const response = await loginUser({
                    username: formData.userIdentifier, // or email depending on your API
                    password: formData.password
                });
                
                // Update global user state
                if (response.user) {
                    setUsername(response.user.username || response.user.displayName);
                }
                
                // Redirect to home page
                navigate('/');
            } catch (error) {
                setApiError(
                    error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
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
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="relative">
                                <input
                                    id="userIdentifier"
                                    name="userIdentifier"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-100 placeholder-gray-500"
                                    placeholder="Tên tài khoản hoặc Email"
                                    value={formData.userIdentifier}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                {errors.userIdentifier && (
                                    <p className="mt-1 text-sm text-red-400">{errors.userIdentifier}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-100 placeholder-gray-500"
                                    placeholder="Mật khẩu"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                                />
                                <label htmlFor="remember-me" className="ml-2 text-gray-400">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <a href="/forgot-password" className="text-purple-400 hover:text-purple-300 transition-colors">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className={`w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-[1.02] ${
                                isLoading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
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
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                                <span className="text-sm text-gray-300">Google</span>
                            </button>
                            <button 
                                className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                                disabled={isLoading}
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