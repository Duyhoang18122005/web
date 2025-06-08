//lấy game
import axios from 'axios';

export function GetGame(callback) {
  axios
    .get('http://localhost:8080/api/games')
    .then((response) => {
      callback(null, response.data); // Gọi callback thành công
    })
    .catch((error) => {
      callback(error); // Gọi callback nếu có lỗi
    });
}
//lấy player
