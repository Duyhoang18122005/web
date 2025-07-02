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
// Get topup history
export const getTopupHistory = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get('/payments/topup-history', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching topup history:', error);
        return [];
    }
};
// Hàm gọi API nạp xu
export const topupCoin = async (coin) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.post(
            '/payments/topup',
            { coin },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error topup coin:', error);
        throw error;
    }
};
// Lấy tổng số đơn
export async function fetchOrderCount(token) {
    try {
        const response = await fetch('http://localhost:8080/api/orders/count', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching order count:', error);
        return null;
    }
}

// Lấy tổng doanh thu 
export async function fetchTodayRevenue(token) {
    try {
        const response = await fetch('http://localhost:8080/api/game-players/revenue/total', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching today\'s revenue:', error);
        return null;
    }
}

