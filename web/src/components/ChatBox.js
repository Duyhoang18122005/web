import React from "react";

function ChatBox({ showChatBox, setShowChatBox, gamers }) {
  return (
    <div
      className={`fixed bottom-0 right-4 z-50 w-72 transition-all duration-300 ${
        showChatBox ? "h-96" : "h-12"
      }`}
    >
      <div
        className="bg-gray-800 rounded-t-lg shadow-lg overflow-hidden cursor-pointer"
        onClick={() => setShowChatBox(!showChatBox)}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-comments mr-2"></i>
            <span className="font-medium">Tin nhắn</span>
          </div>
          <i className={`fas ${showChatBox ? "fa-chevron-down" : "fa-chevron-up"}`}></i>
        </div>

        {/* Nội dung chat */}
        {showChatBox && (
          <div className="p-4 h-[calc(100%-48px)] flex flex-col">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border-none text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {gamers.slice(0, 4).map((gamer) => (
                <div
                  key={gamer.id}
                  className="flex items-center p-2 hover:bg-gray-700 rounded-lg cursor-pointer mb-2"
                >
                  <div className="relative">
                    <img
                      src={gamer.avatar}
                      alt={gamer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {gamer.online && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-gray-800 rounded-full"></span>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-sm">{gamer.name}</div>
                    <div className="text-xs text-gray-400">
                      {gamer.online ? "Đang hoạt động" : "Không hoạt động"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBox;
