//lấy game
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Get all games
export const getAllGames = async () => {
    try {
        const response = await api.get('/game-players/games');
        console.log('Games response:', response.data);
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching games:', error);
        return [];
    }
};

// Get game by ID
export const getGameById = async (gameId) => {
    try {
        const response = await api.get(`/games/${gameId}`);
        console.log('Game details response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching game details:', error);
        return null;
    }
};

// Get game roles
export const getGameRoles = async (gameId) => {
    try {
        const response = await api.get(`/game-players/game/${gameId}/roles`);
        console.log('Game roles response:', response.data);
        
        if (response.data && response.data.success) {
            return response.data.data || [];
        }
        return [];
    } catch (error) {
        console.error('Error fetching game roles:', error);
        return [];
    }
};

//lấy player
