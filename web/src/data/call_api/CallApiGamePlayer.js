import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
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
        const response = await api.get('/games');
        // Ensure we return an array even if the response is empty
        const games = Array.isArray(response.data) ? response.data : [];
        console.log('Fetched games:', games); // Debug log
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
        return []; // Return empty array on error
    }
};

// Get game players by game
export const getGamePlayersByGame = async (gameId) => {
    try {
        const response = await api.get(`/game-players/game/${gameId}`);
        const data = response.data?.data || [];
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching game players:', error);
        return [];
    }
};

// Get game players by rank
export const getGamePlayersByRank = async (rank) => {
    try {
        const response = await api.get(`/game-players/rank/${rank}`);
        const data = response.data?.data || [];
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching players by rank:', error);
        return [];
    }
};

// Get game players by role
export const getGamePlayersByRole = async (role) => {
    try {
        const response = await api.get(`/game-players/role/${role}`);
        const data = response.data?.data || [];
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching players by role:', error);
        return [];
    }
};

// Get game players by server
export const getGamePlayersByServer = async (server) => {
    try {
        const response = await api.get(`/game-players/server/${server}`);
        const data = response.data?.data || [];
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching players by server:', error);
        return [];
    }
};

// Register as game player
export const registerGamePlayer = async (playerData) => {
    try {
        const response = await api.post('/game-players', playerData);
        return response.data;
    } catch (error) {
        console.error('Error registering player:', error);
        throw error; // Re-throw error for handling in component
    }
};

// Get available roles for a game
export const getGameRoles = async (gameId) => {
    try {
        // Ensure gameId is a number
        const numericGameId = parseInt(gameId, 10);
        if (isNaN(numericGameId)) {
            console.error('Invalid game ID:', gameId);
            return [];
        }

        console.log('Fetching roles for game ID:', numericGameId); // Debug log
        const response = await api.get(`/games/${numericGameId}`);
        console.log('Game API response:', response.data); // Debug log

        // Check if response has data
        if (!response.data) {
            console.error('No data in response');
            return [];
        }

        // Check if game has roles enabled
        if (response.data.hasRoles || response.data.has_roles) {
            const roles = response.data.availableRoles || response.data.available_roles || [];
            console.log('Available roles:', roles);
            return Array.isArray(roles) ? roles : [];
        }

        console.log('Game does not have roles enabled');
        return []; // Return empty array if game doesn't have roles
    } catch (error) {
        console.error('Error fetching game roles:', error);
        return [];
    }
};

// Get game ranks
export const getGameRanks = async (gameId) => {
    try {
        const response = await api.get(`/game-players/game/${gameId}/ranks`);
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching game ranks:', error);
        return [];
    }
}; 