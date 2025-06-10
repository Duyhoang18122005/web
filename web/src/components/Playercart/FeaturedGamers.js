import { useNavigate } from "react-router-dom";

const FeaturedGamers = ({ gamers, activeFilter }) => {
  const navigate = useNavigate();

  // Lọc theo game nếu có chọn lọc, ngược lại hiển thị tất cả
  const filteredGamers =
    activeFilter === "all"
      ? gamers
      : gamers.filter((g) => g.game?.name === activeFilter);

  // Lọc ra gamers có user duy nhất (unique theo user.id hoặc username)
  const uniqueGamers = [];
  const seenUserIds = new Set();

  for (const gamer of filteredGamers) {
    const userId = gamer.user?.id || gamer.username;
    if (!seenUserIds.has(userId)) {
      seenUserIds.add(userId);
      uniqueGamers.push(gamer);
    }
  }

  // Hàm hiển thị số sao
  const renderStars = (rating) => {
    const stars = [];
    const starCount = Math.round(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i < starCount ? "text-yellow-400" : "text-gray-500"}`}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div>
      {/* Tiêu đề cho component */}
      <h2 className="text-3xl font-bold mb-6 text-white">
        Danh sách game thủ nổi bật
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueGamers.map((gamer) => {
          console.log("game1:", gamer)
          const name = gamer.username || "chim sẻ đi nắng";
          const gameName = gamer.game.name || "League of Legends mobie";
          const avatar =
            gamer.user?.avatarUrl ||
            gamer.user?.profileImageUrl ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          const price = `${gamer.price} VND`;
          const rating = gamer.rating ?? 5;

          return (
            <div
              key={gamer.id}
              onClick={() => navigate(`/profile/${gamer.id}`)}
              className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="relative">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                    />
                    {gamer.status === "AVAILABLE" && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></span>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{name}</h3>
                        <div className="flex items-center text-sm text-gray-400 mb-1">
                          <i className="fas fa-gamepad mr-1"></i>
                          <span>{gameName}</span>
                        </div>
                        <div className="flex">
                          {renderStars(rating)}
                          <span className="ml-1 text-sm text-gray-400">({rating})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-bold">{price}</div>
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
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedGamers;
