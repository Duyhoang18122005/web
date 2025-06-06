import React from "react";
import { useNavigate } from "react-router-dom";

function FeaturedGamers({ gamers, games, activeFilter, setActiveFilter, renderStars }) {
  const navigate = useNavigate();

  const filteredGamers =
    activeFilter === "all"
      ? gamers
      : gamers.filter((g) => g.game === activeFilter);

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <i className="fas fa-star text-purple-400 mr-2"></i>
          Game Thủ Nổi Bật
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all !rounded-button whitespace-nowrap cursor-pointer ${
              activeFilter === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Tất cả
          </button>
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setActiveFilter(game.name)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all !rounded-button whitespace-nowrap cursor-pointer ${
                activeFilter === game.name
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {game.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGamers.map((gamer) => (
          <div
            key={gamer.id}
            onClick={() => navigate(`/profile/${gamer.id}`)}
            className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer"
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className="relative">
                  <img
                    src={gamer.avatar}
                    alt={gamer.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                  />
                  {gamer.online && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></span>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{gamer.name}</h3>
                      <div className="flex items-center text-sm text-gray-400 mb-1">
                        <i className="fas fa-gamepad mr-1"></i>
                        <span>{gamer.game}</span>
                      </div>
                      <div className="flex">
                        {renderStars(gamer.rating)}
                        <span className="ml-1 text-sm text-gray-400">
                          ({gamer.rating})
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 font-bold">{gamer.price}</div>
                      <div className="text-xs text-gray-400">mỗi giờ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-4 py-2 rounded-full font-medium transition-all w-full whitespace-nowrap cursor-pointer">
                  Đặt lịch
                </button>
                <button className="ml-2 bg-gray-700 hover:bg-gray-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all">
                  <i className="fas fa-comment-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-medium transition-all">
          Xem thêm game thủ
          <i className="fas fa-chevron-down ml-2"></i>
        </button>
      </div>
    </section>
  );
}

export default FeaturedGamers;
