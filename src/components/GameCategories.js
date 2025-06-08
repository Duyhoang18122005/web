import { useEffect, useState } from 'react';
import { GetGame } from '../data/call_api/CallApiGame';
function GameCategories() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    GetGame((err, data) => {
      if (err) {
        console.error("Lỗi khi lấy game:", err);
      } else {
        console.log("Dữ liệu từ API:", data);
        setGames(data);
      }
    });
  }, []);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <i className="fas fa-gamepad text-purple-400 mr-2"></i>
        Danh Mục Game
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-gray-800 rounded-xl p-4 text-center hover:bg-gray-700 transition-all group cursor-pointer"
          >
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <i className="fas fa-gamepad text-2xl"></i>
            </div>
            <h3 className="font-medium mb-1">{game.name}</h3>
            <p className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">
              1276 người chơi online
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GameCategories;
