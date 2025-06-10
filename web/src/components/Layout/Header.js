import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Header({ isLoggedIn, username, avatarUrl, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeout = useRef(null);
  const animationDuration = 200; // ms

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdownWithDelay();
      }
    };

    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        closeDropdownWithDelay();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const openDropdown = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setIsVisible(true);
    setDropdownOpen(true);
  };

  const closeDropdownWithDelay = () => {
    setDropdownOpen(false);
    closeTimeout.current = setTimeout(() => {
      setIsVisible(false);
      closeTimeout.current = null;
    }, animationDuration);
  };

  const handleMouseEnter = () => {
    openDropdown();
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      closeDropdownWithDelay();
    }, 300);
  };

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <header className="bg-gray-800 shadow-lg relative z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">
          <span className="text-purple-400">Player</span>Duo
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-white">
          <Link to="/">Trang chủ</Link>
          <Link to="#">Game</Link>
          <Link to="#">Streamer</Link>
          <Link to="#">Nạp tiền</Link>
        </nav>

         <div className="hidden md:block w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm game thủ, streamer..."
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

        <div
          className="relative flex items-center space-x-4"
          ref={dropdownRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full font-medium hover:from-purple-700 hover:to-blue-600"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="ml-2 text-white hover:text-purple-400"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              {/* Notification Bell */}
              <button
                className="relative p-2 text-gray-400 hover:text-white focus:outline-none"
                onClick={() => {/* Handle notification click */}}
              >
                <i className="fas fa-bell text-xl"></i>
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  0
                </span>
              </button>

              {/* Balance Display */}
              <div className="flex items-center bg-gray-700 rounded-full px-3 py-1">
                <span className="text-white font-medium">+0</span>
                <span className="ml-1 text-gray-400">đ</span>
              </div>

              {/* User Avatar Button */}
              <button
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                className="flex items-center space-x-2 focus:outline-none"
                type="button"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={avatarUrl || defaultAvatar}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white text-sm">
                  <div>{username}</div>
                  <div className="text-xs text-gray-400">ID: 27025960</div>
                </div>
              </button>

              {isVisible && (
                <div
                  className={`absolute right-0 mt-2 w-64 bg-[#1A1D24] text-gray-200 rounded-lg shadow-xl overflow-hidden z-[9999]
                    origin-top-right transform transition-all duration-200 ease-out
                    ${
                      dropdownOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }
                  `}
                  style={{ top: "100%" }}
                  role="menu"
                >
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center">
                      <img
                        src={avatarUrl || defaultAvatar}
                        className="w-10 h-10 rounded-full mr-3"
                        alt="avatar"
                      />
                      <div>
                        <div className="font-medium text-white">{username}</div>
                        <div className="text-xs text-gray-400">ID: 27025960</div>
                      </div>
                    </div>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/withdraw"
                        className="flex items-center px-4 py-2 hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => closeDropdownWithDelay()}
                      >
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full mr-3">
                          <i className="fas fa-minus"></i>
                        </span>
                        Rút tiền
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/security"
                        className="flex items-center px-4 py-2 hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => closeDropdownWithDelay()}
                      >
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full mr-3">
                          <i className="fas fa-user-shield"></i>
                        </span>
                        Tạo khóa bảo vệ
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/transactions"
                        className="flex items-center px-4 py-2 hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => closeDropdownWithDelay()}
                      >
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full mr-3">
                          <i className="fas fa-history"></i>
                        </span>
                        Lịch sử giao dịch
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/following"
                        className="flex items-center px-4 py-2 hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => closeDropdownWithDelay()}
                      >
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full mr-3">
                          <i className="fas fa-users"></i>
                        </span>
                        Theo dõi Players
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => closeDropdownWithDelay()}
                      >
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full mr-3">
                          <i className="fas fa-cog"></i>
                        </span>
                        Cài đặt tài khoản
                      </Link>
                    </li>
                    <li>
                      <button
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => {
                          onLogout();
                          closeDropdownWithDelay();
                        }}
                      >
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full mr-3">
                          <i className="fas fa-power-off"></i>
                        </span>
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
