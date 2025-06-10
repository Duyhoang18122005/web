import React from 'react';

const SkillsSection = ({
  activeTab,
  setActiveTab,
  isFollowing,
  setIsFollowing,
  setIsOrderModalOpen,
  setIsChatOpen,
}) => {
  return (
    <div className="w-full p-6 border-l border-gray-200">
      {/* Top Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <div className="flex space-x-2">
          <button className="border border-gray-300 rounded-md px-4 py-2 text-sm flex items-center cursor-pointer whitespace-nowrap">
            <i className="far fa-share-square mr-2"></i>
            Chia Sẻ
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm flex items-center cursor-pointer ${
              isFollowing
                ? 'bg-gray-200 text-gray-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            <i className={`${isFollowing ? 'fas fa-check' : 'fas fa-plus'} mr-2`}></i>
            {isFollowing ? 'Đã Theo Dõi' : 'Theo Dõi'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-4">
        <div className="flex">
          {['skills', 'moments'].map((tab) => (
            <button
              key={tab}
              className={`py-3 px-6 font-medium text-sm cursor-pointer ${
                activeTab === tab
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-purple-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'skills' ? 'Kỹ Năng' : 'Khoảnh Khắc'}
            </button>
          ))}
        </div>
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          {
            name: 'Liên Quân Mobile',
            views: '5.250+ lượt xem',
            img: 'https://readdy.ai/api/search-image?query=mobile%20legends%20game%20logo&width=50&height=50&seq=7',
          },
          {
            name: 'PUBG Mobile',
            views: '2.820+ lượt xem',
            img: 'https://readdy.ai/api/search-image?query=PUBG%20mobile%20game%20logo&width=50&height=50&seq=8',
          },
          {
            name: 'Cờ Hậu',
            views: '950+ lượt xem',
            img: 'https://readdy.ai/api/search-image?query=colorful%20casual%20mobile%20game%20logo&width=50&height=50&seq=9',
          },
        ].map((game, idx) => (
          <div key={idx} className="flex items-center p-3 bg-white rounded-lg border shadow-sm">
            <img src={game.img} alt={game.name} className="w-12 h-12 rounded-md mr-3 object-cover" />
            <div>
              <h3 className="font-medium">{game.name}</h3>
              <div className="text-xs text-gray-500 flex items-center">
                <i className="fas fa-eye mr-1"></i> {game.views}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Game Block */}
      <div className="bg-white rounded-lg border p-4 mb-6 shadow-sm">
        <div className="flex mb-3">
          <img
            src="https://readdy.ai/api/search-image?query=chess%20strategy%20game%20logo&width=80&height=80&seq=10"
            alt="Đấu Trường Chân Lý"
            className="w-16 h-16 rounded-md object-cover mr-4"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Đấu Trường Chân Lý</h3>
            <div className="text-sm text-gray-600 mb-1">
              <span>5.000+ Đơn Hàng</span>
              <span className="mx-2">•</span>
              <span>Hạng A+</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs flex items-center">
                <i className="fas fa-star text-yellow-500 mr-1"></i> 4.9
              </span>
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">HOT</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="flex-1 border border-purple-500 text-purple-600 py-2 rounded-full font-medium hover:bg-purple-50"
          >
            Đặt Đơn
          </button>
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-full font-medium hover:from-pink-600 hover:to-purple-700 flex items-center justify-center"
          >
            <i className="fas fa-comment-dots mr-2"></i> Chat
          </button>
        </div>
      </div>

      {/* Game Info */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <i className="fas fa-gamepad text-purple-500 mr-2"></i>
          <h3 className="font-medium">Thông Tin Game</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <i className="fas fa-volume-up text-blue-500"></i>
          </div>
          <span className="text-sm text-gray-600">Chat voice với Linh nè</span>
        </div>
      </div>

      {/* Game Preview */}
      <div className="rounded-lg overflow-hidden border">
        <img
          src="https://readdy.ai/api/search-image?query=mobile%20gaming%20interface%20screenshot&width=600&height=300&seq=11"
          alt="Game Preview"
          className="w-full h-48 object-cover"
        />
      </div>
    </div>
  );
};

export default SkillsSection;
