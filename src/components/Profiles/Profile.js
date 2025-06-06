import { useParams } from 'react-router-dom';
import { featuredGamers } from '../../data/MockData';

import ProfileHeader from './ProfileHeader';
import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import ScheduleSection from './ScheduleSection';
import ReviewsSection from './ReviewsSection';
import PricingPackages from './PricingPackages';
import ContactInfo from './ContactInfo';
import Footer from '../Layout/Footer';
import ChatBox from '../ChatBox';

function Profile() {
  const { gamerId } = useParams();
const gamer = featuredGamers.find(g => g.id === Number(gamerId));



  if (!gamer) {
    return <div className="text-white p-4">Không tìm thấy game thủ.</div>;
  }

  const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
  const timeSlots = ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
  const scheduleData = {
    "Thứ 2": ["available", "booked", "available", "available", "booked", "available", "booked", "available"],
    "Thứ 3": ["booked", "available", "available", "booked", "available", "available", "available", "booked"],
    "Thứ 4": ["available", "available", "booked", "available", "available", "booked", "available", "available"],
    "Thứ 5": ["booked", "available", "available", "available", "booked", "available", "available", "booked"],
    "Thứ 6": ["available", "booked", "available", "booked", "available", "available", "booked", "available"],
    "Thứ 7": ["booked", "available", "booked", "available", "available", "booked", "available", "available"],
    "Chủ Nhật": ["available", "available", "available", "booked", "available", "available", "booked", "available"],
  };

  const reviews = [
    {
      id: 1,
      name: "GamerX123",
      avatar: "https://readdy.ai/api/search-image?query=Young%20Vietnamese%20male%20gamer&width=60&height=60",
      rating: 5,
      comment: "Rất chuyên nghiệp và vui tính!",
      date: "15/05/2025"
    },
    {
      id: 2,
      name: "LinhGaming",
      avatar: "https://readdy.ai/api/search-image?query=Young%20Vietnamese%20female%20gamer&width=60&height=60",
      rating: 4,
      comment: "Hỗ trợ tận tình, sẽ quay lại!",
      date: "12/05/2025"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
          >
            <i className="fas fa-arrow-left mr-2"></i> Quay lại danh sách game thủ
          </a>
        </div>
                    <div className="w-full bg-white shadow-sm">
                      <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/5">
              <ProfileHeader  gamer={gamer} />
              <AboutSection gamer={gamer} />
              <ScheduleSection weekDays={weekDays}
              timeSlots={timeSlots}
              scheduleData={scheduleData}/>
             
            </div>
            <div className="w-full md:w-3/5">
              
                <SkillsSection/>
              
              
              <ReviewsSection reviews={reviews} />
          </div>
          </div>
                    </div>
                 
        
        
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
