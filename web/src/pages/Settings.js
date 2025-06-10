import React, { useState, useEffect } from 'react';
import { getAllGames, getGameRoles } from '../data/call_api/CallApiGame';
import { registerGamePlayer } from '../data/call_api/CallApiGamePlayer';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [games, setGames] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId') || '',
        gameId: '',
        username: '',
        rank: '',
        role: '',
        server: '',
        pricePerHour: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch games when component mounts
    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                const gamesData = await getAllGames();
                console.log('Fetched games:', gamesData);
                setGames(gamesData || []);
            } catch (err) {
                setError('Failed to load games');
                console.error('Error fetching games:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    // Fetch roles when game is selected
    useEffect(() => {
        const fetchRoles = async () => {
            if (formData.gameId) {
                try {
                    setLoading(true);
                    console.log('Fetching roles for game ID:', formData.gameId);
                    const roles = await getGameRoles(formData.gameId);
                    console.log('Fetched roles:', roles);
                    setAvailableRoles(roles);
                } catch (err) {
                    setError('Failed to load roles');
                    console.error('Error fetching roles:', err);
                    setAvailableRoles([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setAvailableRoles([]); // Reset roles when no game is selected
            }
        };
        fetchRoles();
    }, [formData.gameId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('Input changed:', name, value);

        if (name === 'gameId') {
            // When game changes, reset role and fetch new roles
            setFormData(prev => ({
                ...prev,
                gameId: value,
                role: '' // Reset role
            }));
            console.log('Game changed to:', value);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Process usernames: trim whitespace and filter out empty strings
        const usernames = formData.username
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);

        if (usernames.length === 0) {
            setError('Vui lòng nhập ít nhất một tên nhân vật');
            setLoading(false);
            return;
        }

        try {
            // Create the request data with processed usernames
            const requestData = {
                ...formData,
                username: usernames.join(', ') // Join usernames with comma and space
            };

            const response = await registerGamePlayer(requestData);
            // Show success message
            alert('Đăng ký thành công!');
            // Reset form
            setFormData({
                userId: localStorage.getItem('userId') || '',
                gameId: '',
                username: '',
                rank: '',
                role: '',
                server: '',
                pricePerHour: '',
                description: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register as player');
            console.error('Error registering player:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 space-y-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-4 py-2 rounded-lg ${
                                activeTab === 'profile' ? 'bg-purple-600' : 'hover:bg-gray-800'
                            }`}
                        >
                            Hồ sơ
                        </button>
                        <button
                            onClick={() => setActiveTab('player-registration')}
                            className={`w-full text-left px-4 py-2 rounded-lg ${
                                activeTab === 'player-registration' ? 'bg-purple-600' : 'hover:bg-gray-800'
                            }`}
                        >
                            Đăng ký làm Player
                        </button>
                    </div>

                    {/* Main content */}
                    <div className="flex-1">
                        {activeTab === 'player-registration' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold mb-4">Đăng ký làm Player</h2>
                                {error && (
                                    <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Game Selection */}
                                    <div>
                                        <label className="block mb-2">Loại game bạn chơi</label>
                                        <select
                                            name="gameId"
                                            value={formData.gameId}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                            required
                                            disabled={loading}
                                        >
                                            <option value="">Chọn game</option>
                                            {games.map(game => (
                                                <option key={game.id} value={game.id}>
                                                    {game.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Server Selection */}
                                    <div>
                                        <label className="block mb-2">Server</label>
                                        <select
                                            name="server"
                                            value={formData.server}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                            required
                                            disabled={loading}
                                        >
                                            <option value="">Chọn server</option>
                                            <option value="VN">Việt Nam</option>
                                            <option value="NA">North America</option>
                                            <option value="EUW">Europe West</option>
                                            <option value="KR">Korea</option>
                                            <option value="JP">Japan</option>
                                        </select>
                                    </div>

                                    {/* Rank Selection */}
                                    <div>
                                        <label className="block mb-2">Rank hiện tại</label>
                                        <select
                                            name="rank"
                                            value={formData.rank}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                            required
                                            disabled={loading}
                                        >
                                            <option value="">Chọn rank</option>
                                            <option value="IRON">Sắt</option>
                                            <option value="BRONZE">Đồng</option>
                                            <option value="SILVER">Bạc</option>
                                            <option value="GOLD">Vàng</option>
                                            <option value="PLATINUM">Bạch Kim</option>
                                            <option value="DIAMOND">Kim Cương</option>
                                            <option value="MASTER">Cao Thủ</option>
                                            <option value="GRANDMASTER">Đại Cao Thủ</option>
                                            <option value="CHALLENGER">Thách Đấu</option>
                                        </select>
                                    </div>

                                    {/* Role Selection */}
                                    <div>
                                        <label className="block mb-2">Vị trí/Role chính</label>
                                        {loading ? (
                                            <div className="text-gray-400">Đang tải roles...</div>
                                        ) : availableRoles && availableRoles.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {availableRoles.map(role => (
                                                    <label
                                                        key={role}
                                                        className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer ${
                                                            formData.role === role
                                                                ? 'bg-purple-600'
                                                                : 'bg-gray-800 hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            value={role}
                                                            checked={formData.role === role}
                                                            onChange={handleInputChange}
                                                            className="form-radio text-purple-600"
                                                        />
                                                        <span>{role}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-gray-400">Game này không yêu cầu chọn role</div>
                                        )}
                                    </div>

                                    {/* Username */}
                                    <div>
                                        <label className="block mb-2">Tên nhân vật trong game</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                            placeholder="Nhập tên nhân vật của bạn trong game (nếu có nhiều tên, ngăn cách bằng dấu phẩy)"
                                            required
                                            disabled={loading}
                                        />
                                        <p className="mt-1 text-sm text-gray-400">
                                            Ví dụ: NhanVat1, NhanVat2, NhanVat3
                                        </p>
                                    </div>

                                    {/* Price per hour */}
                                    <div>
                                        <label className="block mb-2">Giá theo giờ (VNĐ)</label>
                                        <input
                                            type="number"
                                            name="pricePerHour"
                                            value={formData.pricePerHour}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                            placeholder="Ví dụ: 50000"
                                            required
                                            min="0"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block mb-2">Mô tả về bạn</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 h-32"
                                            placeholder="Giới thiệu về bản thân và kỹ năng chơi game của bạn..."
                                            maxLength="500"
                                            disabled={loading}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className={`w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg ${
                                            loading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Đang xử lý...' : 'Đăng ký làm Player'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Hồ sơ</h2>
                                {/* Add profile content here */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;