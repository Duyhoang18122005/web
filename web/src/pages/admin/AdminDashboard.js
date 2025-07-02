import * as echarts from 'echarts';
import { useEffect, useState } from 'react';
import { fetchOrderGrowthPercentYesterday, fetchRevenueGrowthPercentYesterday } from '../../data/call_api/CallApiOder';
import { fetchUserCount } from '../../data/call_api/CallApiPlayer';
import { fetchOrderCount, fetchTodayRevenue } from '../../data/call_api/CallApiTopupHistory';
import { fetchUserGrowthPercent } from '../../data/call_api/CallApiUser';

const AdminDashboard = () => { // Removed : React.FC
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(5);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7days');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Removed : number | null
  const [userCount, setUserCount] = useState(null);
  const [orderCount, setOrderCount] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [userGrowthPercent, setUserGrowthPercent] = useState(null);
  const [orderGrowthPercent, setOrderGrowthPercent] = useState(null);
  const [revenueGrowthPercent, setRevenueGrowthPercent] = useState(null);

  // Mẫu dữ liệu người dùng
  const users = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', role: 'Gamer', status: 'active', joinDate: '15/06/2025', balance: '1,500,000đ' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', role: 'User', status: 'active', joinDate: '10/06/2025', balance: '750,000đ' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', role: 'Gamer', status: 'inactive', joinDate: '05/06/2025', balance: '2,300,000đ' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@gmail.com', role: 'User', status: 'active', joinDate: '01/06/2025', balance: '350,000đ' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@gmail.com', role: 'Gamer', status: 'pending', joinDate: '28/05/2025', balance: '1,200,000đ' },
    { id: 6, name: 'Đỗ Thị F', email: 'dothif@gmail.com', role: 'User', status: 'active', joinDate: '25/05/2025', balance: '500,000đ' },
    { id: 7, name: 'Vũ Văn G', email: 'vuvang@gmail.com', role: 'Gamer', status: 'inactive', joinDate: '20/05/2025', balance: '1,800,000đ' },
    { id: 8, name: 'Ngô Thị H', email: 'ngothih@gmail.com', role: 'User', status: 'active', joinDate: '15/05/2025', balance: '650,000đ' },
  ];

  // Lấy tổng số người dùng từ BE
  useEffect(() => {
    fetchUserCount().then((data) => {
      if (typeof data === 'number') setUserCount(data);
      else if (data && typeof data.count === 'number') setUserCount(data.count);
    });
  }, []);

  // Lấy tổng số đơn từ BE
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchOrderCount(token).then((data) => {
        if (typeof data === 'number') setOrderCount(data);
        else if (data && typeof data.count === 'number') setOrderCount(data.count);
      });
    }
  }, []);

  // Lấy tổng doanh thu từ BE
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchTodayRevenue(token).then((data) => {
        if (typeof data === 'number') setRevenue(data);
        else if (data && typeof data.revenue === 'number') setRevenue(data.revenue);
      });
    }
  }, []);

  // Lấy % tăng trưởng người dùng so với tuần trước
  useEffect(() => {
    fetchUserGrowthPercent().then((data) => {
      if (data && typeof data.percent === 'number') setUserGrowthPercent(data.percent);
    });
  }, []);

  // Lấy % tăng trưởng đơn so với hôm qua
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchOrderGrowthPercentYesterday(token).then((data) => {
        if (typeof data === 'number') setOrderGrowthPercent(data);
        else if (data && typeof data.percent === 'number') setOrderGrowthPercent(data.percent);
      });
    }
  }, []);

  // Lấy % tăng trưởng doanh thu so với hôm qua
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchRevenueGrowthPercentYesterday(token).then((data) => {
        if (typeof data === 'number') setRevenueGrowthPercent(data);
      });
    }
  }, []);

  // Khởi tạo biểu đồ
  useEffect(() => {
    // Biểu đồ doanh thu
    const revenueChart = echarts.init(document.getElementById('revenue-chart')); // Removed as HTMLDivElement
    const revenueOption = {
      animation: false,
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Doanh thu', 'Đơn thuê'],
        textStyle: {
          color: darkMode ? '#ffffff' : '#333333' // Adjust legend text color based on dark mode
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['20/06', '21/06', '22/06', '23/06', '24/06', '25/06', '26/06'],
        axisLabel: {
          color: darkMode ? '#ccc' : '#555' // Adjust axis label color
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: darkMode ? '#ccc' : '#555' // Adjust axis label color
        }
      },
      series: [
        {
          name: 'Doanh thu',
          type: 'line',
          data: [5200000, 4800000, 6500000, 7200000, 6800000, 7500000, 8200000],
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#4F46E5'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(79, 70, 229, 0.4)'
              }, {
                offset: 1, color: 'rgba(79, 70, 229, 0.1)'
              }]
            }
          }
        },
        {
          name: 'Đơn thuê',
          type: 'line',
          data: [120, 132, 145, 160, 152, 168, 180],
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#10B981'
          }
        }
      ]
    };
    revenueChart.setOption(revenueOption);

    // Biểu đồ phân bổ người dùng
    const userChart = echarts.init(document.getElementById('user-chart')); // Removed as HTMLDivElement
    const userOption = {
      animation: false,
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          color: darkMode ? '#ffffff' : '#333333' // Adjust legend text color based on dark mode
        }
      },
      series: [
        {
          name: 'Phân bổ người dùng',
          type: 'pie',
          radius: '70%',
          data: [
            { value: 1548, name: 'Người dùng thường' },
            { value: 735, name: 'Game thủ' },
            { value: 580, name: 'Người dùng mới' },
            { value: 120, name: 'Admin' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false // Hide labels on the pie chart itself
          }
        }
      ]
    };
    userChart.setOption(userOption);

    // Resize charts on window resize
    const handleResize = () => {
      revenueChart.resize();
      userChart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      revenueChart.dispose();
      userChart.dispose();
    };
  }, [darkMode]); // Re-render charts when dark mode changes to update text color

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleDeleteUser = (id) => { // Removed : number
    setSelectedUser(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Xử lý xóa người dùng
    console.log(`Deleting user with ID: ${selectedUser}`);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <header className={`fixed w-full z-30 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm rounded-b-lg`}>
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none cursor-pointer">
              <i className="fas fa-bars text-xl"></i>
            </button>
            <div className="ml-4 flex items-center">
              <span className="text-xl font-bold text-indigo-600">PlayerDuo</span>
              <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md dark:bg-indigo-700 dark:text-indigo-100">Admin</span>
            </div>
          </div>

          <div className="w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className={`w-full pl-10 pr-4 py-2 rounded-full border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2 cursor-pointer">
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-lg text-gray-600 dark:text-gray-300`}></i>
            </button>

            <div className="relative mr-2">
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                <i className="fas fa-bell text-lg text-gray-600 dark:text-gray-300"></i>
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center -translate-y-1 translate-x-1">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <div onClick={toggleUserDropdown} className="flex items-center cursor-pointer p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <img
                  src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20male%20administrator%20with%20short%20black%20hair%20wearing%20a%20business%20casual%20outfit%2C%20neutral%20expression%2C%20clean%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=1&orientation=squarish"
                  alt="Admin"
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500"
                />
                <span className={`ml-2 font-medium hidden md:block ${darkMode ? 'text-white' : 'text-gray-800'}`}>Nguyễn Admin</span>
                <i className={`fas fa-chevron-down ml-1 text-xs transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
              </div>

              {userDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ring-1 ring-black ring-opacity-5 z-40`}>
                  <a href="#" className={`block px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-md mx-1`}>
                    <i className="fas fa-user mr-2"></i> Hồ sơ cá nhân
                  </a>
                  <a href="#" className={`block px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-md mx-1`}>
                    <i className="fas fa-cog mr-2"></i> Cài đặt
                  </a>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <a href="#" className={`block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400 rounded-md mx-1`}>
                    <i className="fas fa-sign-out-alt mr-2"></i> Đăng xuất
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-20 w-64 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg pt-16 rounded-r-lg`}>
        <div className="h-full overflow-y-auto">
          <nav className="px-4 py-4">
            <div className="space-y-1">
              <a href="#" className="flex items-center px-3 py-3 text-sm font-medium rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white">
                <i className="fas fa-tachometer-alt w-6 text-center"></i>
                <span className="ml-3">Tổng quan</span>
              </a>

              <div className="pt-2">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Quản lý người dùng</p>
                <a href="#" className={`mt-1 flex items-center px-3 py-3 text-sm font-medium rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <i className="fas fa-users w-6 text-center"></i>
                  <span className="ml-3">Danh sách người dùng</span>
                </a>
                <a href="#" className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <i className="fas fa-gamepad w-6 text-center"></i>
                  <span className="ml-3">Game thủ</span>
                </a>
              </div>

              <div className="pt-2">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Giao dịch</p>
                <a href="#" className={`mt-1 flex items-center px-3 py-3 text-sm font-medium rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <i className="fas fa-shopping-cart w-6 text-center"></i>
                  <span className="ml-3">Đơn thuê</span>
                </a>
                <a href="#" className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <i className="fas fa-money-bill-wave w-6 text-center"></i>
                  <span className="ml-3">Thanh toán</span>
                </a>
              </div>

              <div className="pt-2">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Nội dung</p>
                <a href="#" className={`mt-1 flex items-center px-3 py-3 text-sm font-medium rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <i className="fas fa-flag w-6 text-center"></i>
                  <span className="ml-3">Báo cáo vi phạm</span>
                </a>
                <a href="#" className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <i className="fas fa-images w-6 text-center"></i>
                  <span className="ml-3">Banner & Thông báo</span>
                </a>
              </div>

              <div className="pt-2">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Hệ thống</p>
                <a href="#" className={`mt-1 flex items-center px-3 py-3 text-sm font-medium rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <i className="fas fa-chart-line w-6 text-center"></i>
                  <span className="ml-3">Thống kê & Báo cáo</span>
                </a>
                <a href="#" className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <i className="fas fa-cog w-6 text-center"></i>
                  <span className="ml-3">Cài đặt hệ thống</span>
                </a>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 ${sidebarOpen ? 'md:ml-64' : ''} transition-all duration-300`}>
        <div className="p-6">
          {/* Breadcrumb */}
          <nav className="mb-5 text-sm">
            <ol className="list-reset flex">
              <li><a href="#" className="text-indigo-600 hover:underline">Trang chủ</a></li>
              <li><span className="mx-2 text-gray-500">/</span></li>
              <li className="text-gray-500">Tổng quan</li>
            </ol>
          </nav>

          {/* Page Title */}
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Tổng quan hệ thống</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tổng người dùng</p>
                  <h3 className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{userCount !== null ? userCount : '...'}</h3>
                  <p className="text-sm mt-2 flex items-center text-green-600">
                    <i className="fas fa-arrow-up mr-1"></i> {userGrowthPercent !== null ? `${userGrowthPercent}%` : '...'} <span className="text-gray-500 ml-1 dark:text-gray-400">so với tuần trước</span>
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-blue-100">
                  <i className="fas fa-users text-xl"></i>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tổng số đơn</p>
                  <h3 className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{orderCount !== null ? orderCount : '...'}</h3>
                  <p className="text-sm mt-2 flex items-center text-green-600">
                    <i className="fas fa-arrow-up mr-1"></i> {orderGrowthPercent !== null ? `${orderGrowthPercent}%` : '...'} <span className="text-gray-500 ml-1 dark:text-gray-400">so với hôm qua</span>
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-700 dark:text-purple-100">
                  <i className="fas fa-shopping-cart text-xl"></i>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tổng doanh thu</p>
                  <h3 className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{revenue !== null ? revenue.toLocaleString('vi-VN') + 'đ' : '...'}</h3>
                  <p className="text-sm mt-2 flex items-center text-green-600">
                    <i className="fas fa-arrow-up mr-1"></i> {revenueGrowthPercent !== null ? `${revenueGrowthPercent}%` : '...'} <span className="text-gray-500 ml-1 dark:text-gray-400">so với hôm qua</span>
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-100">
                  <i className="fas fa-money-bill-wave text-xl"></i>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Báo cáo vi phạm</p>
                  <h3 className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>12</h3>
                  <p className="text-sm mt-2 flex items-center text-red-600">
                    <i className="fas fa-arrow-up mr-1"></i> 3 <span className="text-gray-500 ml-1 dark:text-gray-400">chưa xử lý</span>
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-700 dark:text-red-100">
                  <i className="fas fa-flag text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className={`lg:col-span-2 p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Doanh thu & Đơn thuê</h3>
                <div className="relative">
                  <select className={`appearance-none pl-3 pr-8 py-1 text-sm border rounded-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer`}>
                    <option>7 ngày qua</option>
                    <option>30 ngày qua</option>
                    <option>3 tháng qua</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-500 dark:text-gray-400 text-xs"></i>
                  </div>
                </div>
              </div>
              <div id="revenue-chart" className="w-full h-80"></div>
            </div>

            <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Phân bổ người dùng</h3>
                <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
              <div id="user-chart" className="w-full h-80"></div>
            </div>
          </div>

          {/* Recent Users */}
          <div className={`rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden mb-6`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Người dùng gần đây</h3>
                <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm">Xem tất cả</a>
              </div>
            </div>

            <div className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                <div className="w-full md:w-1/3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm người dùng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 rounded-full border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <i className="fas fa-search"></i>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`appearance-none pl-3 pr-8 py-2 border rounded-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer`}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                      <option value="pending">Đang chờ duyệt</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-500 dark:text-gray-400 text-xs"></i>
                    </div>
                  </div>

                  <button onClick={() => setShowExportModal(true)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 flex items-center shadow-sm transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                    <i className="fas fa-download mr-2"></i> Xuất
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Người dùng
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Vai trò
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Trạng thái
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Ngày tham gia
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Số dư
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                    {users.map((user) => (
                      <tr key={user.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                src={`https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20person%20with%20neutral%20expression%2C%20clean%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=${user.id}&orientation=squarish`}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                              />
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Gamer'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100'
                            : user.role === 'Admin'
                              ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                            : user.status === 'inactive'
                              ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                            }`}>
                            {user.status === 'active' ? 'Đang hoạt động' :
                              user.status === 'inactive' ? 'Không hoạt động' : 'Đang chờ duyệt'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.balance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                              <i className="fas fa-ellipsis-v"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${darkMode ? 'bg-gray-700 text-gray-200 dark:border-gray-600' : 'bg-white text-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-600`}>
                    Trước
                  </button>
                  <button onClick={() => setCurrentPage(currentPage + 1)} className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${darkMode ? 'bg-gray-700 text-gray-200 dark:border-gray-600' : 'bg-white text-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-600`}>
                    Tiếp
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">8</span> của <span className="font-medium">68</span> kết quả
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 ${darkMode ? 'bg-gray-700 text-gray-300 dark:border-gray-600' : 'bg-white text-gray-500'} hover:bg-gray-50 dark:hover:bg-gray-600`}>
                        <i className="fas fa-chevron-left text-xs"></i>
                      </button>
                      {[1, 2, 3, 4, 5].map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border ${currentPage === page
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:border-indigo-600 dark:text-indigo-200'
                            : `border-gray-300 ${darkMode ? 'bg-gray-700 text-gray-300 dark:border-gray-600' : 'bg-white text-gray-500'} hover:bg-gray-50 dark:hover:bg-gray-600`
                            } text-sm font-medium`}
                        >
                          {page}
                        </button>
                      ))}
                      <button onClick={() => setCurrentPage(currentPage + 1)} className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 ${darkMode ? 'bg-gray-700 text-gray-300 dark:border-gray-600' : 'bg-white text-gray-500'} hover:bg-gray-50 dark:hover:bg-gray-600`}>
                        <i className="fas fa-chevron-right text-xs"></i>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-xl w-full max-w-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h3 className="text-lg font-bold mb-4">Xuất báo cáo</h3>
            <p className="mb-4 text-sm">Bạn có muốn xuất dữ liệu người dùng không?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                Hủy
              </button>
              <button onClick={() => { /* Implement export logic here */ setShowExportModal(false); }} className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200">
                Xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-xl w-full max-w-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
            <p className="mb-4 text-sm">Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end space-x-3">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                Hủy
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
