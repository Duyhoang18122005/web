// CallApiPlayer.js
import axios from "axios";

export const Getplayer = async (callback) => {
    try {
        const response = await axios.get("http://localhost:8080/api/game-players");
        if (response.data.success && Array.isArray(response.data.data)) {
            callback(null, response.data.data);
        } else {
            callback("Không lấy được dữ liệu người chơi", []);
        }
    } catch (error) {
        callback(error.message || "Lỗi kết nối đến máy chủ", []);
    }
};

// Lấy tổng số người dùng
export async function fetchUserCount() {
    try {
        const response = await fetch('http://localhost:8080/api/users/count');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user count:', error);
        return null;
    }
}
