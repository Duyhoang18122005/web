export async function fetchUserGrowthPercent() {
    try {
        const response = await fetch('http://localhost:8080/api/users/growth-percent');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Nếu data là số, trả về object { percent: data }
        if (typeof data === 'number') {
            return { percent: data };
        }
        return data;
    } catch (error) {
        console.error('Error fetching user growth percent:', error);
        return null;
    }
}
