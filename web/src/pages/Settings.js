import React, { useState, useEffect } from 'react';
import { getAllGames, getGameRoles } from '../data/call_api/CallApiGame';
import { registerGamePlayer, getGameRanks } from '../data/call_api/CallApiGamePlayer';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [games, setGames] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [availableRanks, setAvailableRanks] = useState([]);
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

    // Fetch roles and ranks when game is selected
    useEffect(() => {
        const fetchGameData = async () => {
            if (!formData.gameId) {
                setAvailableRoles([]);
                setAvailableRanks([]);
                return;
            }

            try {
                setLoading(true);
                const [rolesData, ranksData] = await Promise.all([
                    getGameRoles(formData.gameId),
                    getGameRanks(formData.gameId)
                ]);
                setAvailableRoles(rolesData || []);
                setAvailableRanks(ranksData || []);
            } catch (err) {
                setError('Failed to load game data');
                console.error('Error fetching game data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGameData();
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
            // Normalize the data
            const requestData = {
                ...formData,
                userId: Number(formData.userId),
                gameId: Number(formData.gameId),
                pricePerHour: Number(formData.pricePerHour),
                username: usernames.join(', '),
                server: formData.server.toUpperCase(),
                rank: formData.rank.toUpperCase(),
                role: formData.role.toUpperCase()
            };

            console.log('Sending request data:', requestData);
            await registerGamePlayer(requestData);
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
            setError(
                err.response?.data?.message ||
                err.response?.data?.data?.message ||
                err.message ||
                'Failed to register as player'
            );
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

                                    {/* Rank Selection */}
                                    <div>
                                        <label className="block mb-2">Rank trong game</label>
                                        <select
                                            name="rank"
                                            value={formData.rank}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                            required
                                            disabled={loading || !formData.gameId}
                                        >
                                            <option value="">Chọn rank</option>
                                            {availableRanks.map(rank => (
                                                <option key={rank} value={rank}>
                                                    {rank}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Role Selection (if game has roles) */}
                                    {availableRoles.length > 0 && (
                                        <div>
                                            <label className="block mb-2">Vai trò trong game</label>
                                            <select
                                                name="role"
                                                value={formData.role}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Chọn vai trò</option>
                                                {availableRoles.map(role => (
                                                    <option key={role} value={role}>
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Server Input */}
                                    <div>
                                        <label className="block mb-2">Server</label>
                                        <input
                                            type="text"
                                            name="server"
                                            value={formData.server}
                                            onChange={handleInputChange}
                                            placeholder="Nhập server (ví dụ: NA, EU, Garena)"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Username */}
                                    <div>
                                        <label className="block mb-2">Tên tài khoản</label>
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