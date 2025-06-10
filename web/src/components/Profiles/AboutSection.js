import React from 'react';

const AboutSection = ({ gamer }) => {
  return (
     <div className="w-full p-4"> {/* Removed md:w-3/5 as it will be nested */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Giới Thiệu</h2>
        <p className="text-gray-700 mb-4">
          Xin chào! Mình là <strong>{gamer.name}</strong>, một game thủ chuyên nghiệp trò chơi <strong>{gamer.game}</strong> với hơn 8 năm kinh nghiệm.
        </p>
        <p className="text-gray-700 mb-4">
          Mình chuyên hỗ trợ các bạn cải thiện kỹ năng chơi game, từ cơ bản đến nâng cao. Mình có thể giúp bạn leo rank hiệu quả, học cách chơi các vị tướng mới, hoặc đơn giản là có những trận đấu vui vẻ cùng nhau.
        </p>
        <p className="text-gray-700">
          Phong cách giảng dạy của mình tập trung vào việc hiểu rõ điểm mạnh/yếu của người chơi và đưa ra những lời khuyên phù hợp. Mình luôn kiên nhẫn và thân thiện với tất cả mọi người.
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
