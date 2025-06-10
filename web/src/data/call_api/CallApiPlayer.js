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
