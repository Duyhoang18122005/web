export async function fetchOrderGrowthPercentYesterday(token) {
    try {
        const response = await fetch('http://localhost:8080/api/orders/growth-percent-yesterday', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data; // Expecting { percent: number }
    } catch (error) {
        console.error('Error fetching order growth percent yesterday:', error);
        return null;
    }
}

export async function fetchRevenueGrowthPercentYesterday(token) {
    try {
        const response = await fetch('http://localhost:8080/api/game-players/revenue/growth-percent-yesterday', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // API returns a number, not an object
        return data;
    } catch (error) {
        console.error('Error fetching revenue growth percent yesterday:', error);
        return null;
    }
}
