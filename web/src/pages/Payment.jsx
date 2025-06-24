import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionHistory from "../components/TransactionHistory";
import { getCurrentUser } from "../data/call_api/CallApiLoginRegister";
import {
  getTopupHistory,
  topupCoin,
} from "../data/call_api/CallApiTopupHistory";

const Payment = () => {
  const [activeTab, setActiveTab] = useState("topup");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");
  const [selectedPackage, setSelectedPackage] = useState(2);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(0);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());

  // Fetch transaction history when component mounts
  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      const data = await getTopupHistory();
      setTransactionHistory(data);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (!user) {
      alert("Vui lòng đăng nhập tài khoản");
      setTimeout(() => navigate("/login"), 100);
      return;
    }
    setShowPaymentConfirm(true);
  };

  const confirmPayment = async () => {
    setShowPaymentConfirm(false);
    setShowProcessing(true);
    try {
      // Lấy số coin từ gói đã chọn
      const selectedPkg = paymentPackages.find(
        (pkg) => pkg.id === selectedPackage
      );
      const coinValue = parseInt(selectedPkg.amount.replace(/,/g, ""));
      await topupCoin(coinValue);
      setShowProcessing(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Refresh transaction history after successful payment
        fetchTransactionHistory();
      }, 3000);
    } catch (error) {
      setShowProcessing(false);
      alert("Nạp xu thất bại. Vui lòng thử lại!");
    }
  };

  // Dynamic payment packages - can be fetched from API in the future
  const paymentPackages = [
    {
      id: 1,
      amount: "50,000",
      coins: "50",
      bonus: "0%",
      popular: false,
      type: "basic",
    },
    {
      id: 2,
      amount: "100,000",
      coins: "100",
      bonus: "0%",
      popular: true,
      type: "basic",
    },
    {
      id: 3,
      amount: "200,000",
      coins: "210",
      bonus: "5%",
      popular: false,
      type: "basic",
    },
    {
      id: 4,
      amount: "500,000",
      coins: "550",
      bonus: "10%",
      popular: false,
      type: "value",
    },
    {
      id: 5,
      amount: "1,000,000",
      coins: "1,150",
      bonus: "15%",
      popular: false,
      type: "value",
    },
    {
      id: 6,
      amount: "2,000,000",
      coins: "2,400",
      bonus: "20%",
      popular: false,
      type: "vip",
    },
  ];
  const guides = [
    {
      id: 1,
      title: "Nạp tiền qua thẻ tín dụng/ghi nợ",
      content:
        "Hướng dẫn chi tiết cách nạp tiền qua thẻ tín dụng hoặc thẻ ghi nợ quốc tế như Visa, Mastercard, JCB.",
    },
    {
      id: 2,
      title: "Nạp tiền qua ví điện tử",
      content:
        "Hướng dẫn chi tiết cách nạp tiền qua các ví điện tử phổ biến như MoMo, ZaloPay, VNPay, ShopeePay.",
    },
    {
      id: 3,
      title: "Nạp tiền qua chuyển khoản ngân hàng",
      content:
        "Hướng dẫn chi tiết cách nạp tiền qua chuyển khoản ngân hàng trực tiếp vào tài khoản của PlayerDuo.",
    },
    {
      id: 4,
      title: "Các vấn đề thường gặp khi nạp tiền",
      content:
        "Giải đáp các câu hỏi và vấn đề thường gặp trong quá trình nạp tiền vào tài khoản PlayerDuo.",
    },
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "success":
        return "Thành công";
      case "pending":
        return "Đang xử lý";
      case "failed":
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };
  const getPackageTypeClass = (type) => {
    switch (type) {
      case "basic":
        return "from-blue-500 to-indigo-600";
      case "value":
        return "from-purple-500 to-indigo-600";
      case "vip":
        return "from-pink-500 to-orange-500";
      default:
        return "from-blue-500 to-indigo-600";
    }
  };

  // Tính tổng số coin đã nạp thành công
  const totalCoin = transactionHistory
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + (parseInt(t.coin, 10) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nạp Tiền</h1>
          <p className="text-gray-600">
            Nạp tiền nhanh chóng, an toàn và nhận ngay ưu đãi hấp dẫn
          </p>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Balance & Quick Actions */}
          <div>
            {/* Current Balance Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                    <i className="fas fa-coins text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium">
                      Số Dư Hiện Tại
                    </h3>
                    <p className="text-white text-opacity-80 text-sm">
                      Cập nhật: 31/05/2025 14:32
                    </p>
                  </div>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-white text-3xl font-bold">
                    {totalCoin}
                  </span>
                  <span className="text-white text-opacity-90 ml-2">xu</span>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-opacity-90 text-sm">
                      Tỷ lệ quy đổi:
                    </span>
                    <span className="text-white font-medium">
                      1,000đ = 1 xu
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowTransactionHistory(true)}
                    className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer"
                  >
                    <i className="fas fa-history mr-2"></i> Lịch Sử
                  </button>
                  <button
                    onClick={() => setShowGuide(true)}
                    className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer"
                  >
                    <i className="fas fa-question-circle mr-2"></i> Hướng Dẫn
                  </button>
                </div>
              </div>
            </div>
            {/* Promotion Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-orange-500 px-6 py-4">
                <h3 className="text-white text-lg font-bold">
                  Ưu Đãi Đặc Biệt
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <i className="fas fa-gift text-pink-500 text-xl mr-3"></i>
                    <span className="font-medium">Nạp lần đầu</span>
                  </div>
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                    +20%
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt text-indigo-500 text-xl mr-3"></i>
                    <span className="font-medium">Khuyến mãi tháng 5</span>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                    +10%
                  </span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <i className="fas fa-users text-purple-500 text-xl mr-3"></i>
                    <span className="font-medium">Giới thiệu bạn bè</span>
                  </div>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    +5%
                  </span>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">
                      Ưu đãi kết thúc sau:
                    </span>
                    <span className="text-red-600 font-bold">
                      2 ngày 14:35:22
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Support Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Hỗ Trợ Khách Hàng
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <i className="fas fa-headset text-indigo-600"></i>
                    </div>
                    <div>
                      <p className="font-medium">Hotline</p>
                      <p className="text-gray-600">1900 1234</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <i className="fas fa-envelope text-indigo-600"></i>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">support@playerduo.net</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <i className="fas fa-comment-dots text-indigo-600"></i>
                    </div>
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-gray-600">8:00 - 22:00 hàng ngày</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
                  <i className="fas fa-comment-alt mr-2"></i> Chat Ngay
                </button>
              </div>
            </div>
          </div>
          {/* Center & Right Columns - Main Content */}
          <div className="lg:col-span-2">
            {/* Package Selection */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Chọn Gói Nạp Tiền
                </h2>
                <div className="flex mb-6 overflow-x-auto pb-2">
                  <button className="flex-shrink-0 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mr-3 hover:bg-indigo-200 transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
                    Tất cả
                  </button>
                  <button className="flex-shrink-0 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mr-3 hover:bg-gray-200 transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
                    Phổ biến
                  </button>
                  <button className="flex-shrink-0 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mr-3 hover:bg-gray-200 transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
                    Tiết kiệm
                  </button>
                  <button className="flex-shrink-0 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mr-3 hover:bg-gray-200 transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
                    VIP
                  </button>
                  <button className="flex-shrink-0 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
                    Tùy chỉnh
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paymentPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 transform hover:-translate-y-1 ${
                        selectedPackage === pkg.id
                          ? "ring-2 ring-indigo-600 shadow-lg"
                          : "border border-gray-200 shadow-sm"
                      }`}
                    >
                      <div
                        className={`bg-gradient-to-r ${getPackageTypeClass(
                          pkg.type
                        )} p-4`}
                      >
                        {pkg.popular && (
                          <div className="absolute top-0 right-0">
                            <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 transform rotate-0 origin-top-right">
                              PHỔ BIẾN
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-white font-bold text-xl">
                              {pkg.amount} đ
                            </h3>
                            <p className="text-white text-opacity-90 text-sm">
                              Nhận {pkg.coins} xu
                            </p>
                          </div>
                          {pkg.bonus !== "0%" && (
                            <div className="bg-white bg-opacity-30 rounded-full px-2 py-1">
                              <span className="text-white text-sm font-medium">
                                +{pkg.bonus}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <div className="flex justify-between items-center">
                          <div className="text-gray-600 text-sm">
                            <span className="font-medium">Giá trị:</span>{" "}
                            {parseInt(pkg.coins.replace(/,/g, "")) * 1000} đ
                          </div>
                          <button
                            className={`text-sm font-medium ${
                              selectedPackage === pkg.id
                                ? "text-indigo-600"
                                : "text-gray-500"
                            }`}
                          >
                            {selectedPackage === pkg.id ? "Đã chọn" : "Chọn"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Phương Thức Thanh Toán
                </h2>
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setSelectedPaymentMethod("credit")}
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                      selectedPaymentMethod === "credit"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <i className="far fa-credit-card mr-2"></i> Thẻ Tín Dụng /
                    Ghi Nợ
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod("ewallet")}
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                      selectedPaymentMethod === "ewallet"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <i className="fas fa-wallet mr-2"></i> Ví Điện Tử
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod("bank")}
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                      selectedPaymentMethod === "bank"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <i className="fas fa-university mr-2"></i> Chuyển Khoản Ngân
                    Hàng
                  </button>
                </div>
                {selectedPaymentMethod === "credit" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Số Thẻ
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="XXXX XXXX XXXX XXXX"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                            <i className="fab fa-cc-visa text-blue-800"></i>
                            <i className="fab fa-cc-mastercard text-red-600"></i>
                            <i className="fab fa-cc-jcb text-green-700"></i>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Tên Chủ Thẻ
                        </label>
                        <input
                          type="text"
                          placeholder="Họ tên trên thẻ"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Ngày Hết Hạn
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Mã Bảo Mật (CVV)
                        </label>
                        <input
                          type="text"
                          placeholder="XXX"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-start mb-6">
                      <div className="flex items-center h-5">
                        <input
                          id="save-card"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300"
                        />
                      </div>
                      <label
                        htmlFor="save-card"
                        className="ml-2 text-sm font-medium text-gray-600"
                      >
                        Lưu thông tin thẻ cho lần sau (an toàn)
                      </label>
                    </div>
                  </div>
                )}
                {selectedPaymentMethod === "ewallet" && (
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                        <div className="bg-red-100 rounded-full p-3 mb-2">
                          <i className="fas fa-wallet text-red-600 text-xl"></i>
                        </div>
                        <span className="text-sm font-medium">MoMo</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                        <div className="bg-blue-100 rounded-full p-3 mb-2">
                          <i className="fas fa-money-bill-wave text-blue-600 text-xl"></i>
                        </div>
                        <span className="text-sm font-medium">ZaloPay</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                        <div className="bg-green-100 rounded-full p-3 mb-2">
                          <i className="fas fa-qrcode text-green-600 text-xl"></i>
                        </div>
                        <span className="text-sm font-medium">VNPay</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                        <div className="bg-orange-100 rounded-full p-3 mb-2">
                          <i className="fas fa-shopping-bag text-orange-600 text-xl"></i>
                        </div>
                        <span className="text-sm font-medium">ShopeePay</span>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                      <div className="flex items-center mb-4">
                        <i className="fas fa-info-circle text-indigo-600 mr-2"></i>
                        <span className="font-medium">
                          Hướng dẫn thanh toán qua ví MoMo
                        </span>
                      </div>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm pl-2">
                        <li>Mở ứng dụng MoMo trên điện thoại của bạn</li>
                        <li>
                          Quét mã QR hoặc nhập số điện thoại: 0912 345 678
                        </li>
                        <li>
                          Nhập số tiền cần thanh toán:{" "}
                          {
                            paymentPackages.find(
                              (pkg) => pkg.id === selectedPackage
                            )?.amount
                          }{" "}
                          đ
                        </li>
                        <li>
                          Trong phần Lời nhắn, nhập: PD + [Tên tài khoản của
                          bạn]
                        </li>
                        <li>Xác nhận thanh toán</li>
                      </ol>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                      <div className="flex items-center mb-2">
                        <i className="fas fa-qrcode text-indigo-600 mr-2"></i>
                        <span className="font-medium">
                          Quét mã QR để thanh toán
                        </span>
                      </div>
                      <div className="flex justify-center py-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <i className="fas fa-qrcode text-gray-400 text-6xl"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedPaymentMethod === "bank" && (
                  <div>
                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                      <div className="flex items-center mb-4">
                        <i className="fas fa-university text-indigo-600 mr-2"></i>
                        <span className="font-medium">
                          Thông tin chuyển khoản
                        </span>
                      </div>
                      <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between">
                          <span className="font-medium">Ngân hàng:</span>
                          <span>Vietcombank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Số tài khoản:</span>
                          <span className="font-mono">1234 5678 9012</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Chủ tài khoản:</span>
                          <span>CÔNG TY TNHH PLAYER DUO</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Số tiền:</span>
                          <span>
                            {
                              paymentPackages.find(
                                (pkg) => pkg.id === selectedPackage
                              )?.amount
                            }{" "}
                            đ
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Nội dung CK:</span>
                          <span className="font-mono">PD [tên tài khoản]</span>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 mb-6">
                      <h3 className="font-medium mb-4">
                        Hoặc chọn ngân hàng khác:
                      </h3>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        <div className="border border-gray-200 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                          <div className="text-center">
                            <i className="fas fa-university text-green-600 text-xl mb-1"></i>
                            <p className="text-xs">Vietcombank</p>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                          <div className="text-center">
                            <i className="fas fa-university text-blue-600 text-xl mb-1"></i>
                            <p className="text-xs">BIDV</p>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                          <div className="text-center">
                            <i className="fas fa-university text-red-600 text-xl mb-1"></i>
                            <p className="text-xs">Agribank</p>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                          <div className="text-center">
                            <i className="fas fa-university text-purple-600 text-xl mb-1"></i>
                            <p className="text-xs">TPBank</p>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                          <div className="text-center">
                            <i className="fas fa-university text-yellow-600 text-xl mb-1"></i>
                            <p className="text-xs">Techcombank</p>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                          <div className="text-center">
                            <i className="fas fa-university text-gray-600 text-xl mb-1"></i>
                            <p className="text-xs">Khác</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <i className="fas fa-exclamation-circle text-yellow-500 mt-1 mr-3"></i>
                        <div>
                          <p className="font-medium text-yellow-800 mb-1">
                            Lưu ý quan trọng:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                            <li>
                              Vui lòng ghi đúng nội dung chuyển khoản để hệ
                              thống có thể xác nhận giao dịch của bạn.
                            </li>
                            <li>
                              Thời gian xử lý giao dịch từ 5-15 phút trong giờ
                              hành chính.
                            </li>
                            <li>
                              Nếu sau 30 phút bạn chưa nhận được xu, vui lòng
                              liên hệ hỗ trợ.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-start mb-6">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300"
                    />
                  </div>
                  <label
                    htmlFor="terms"
                    className="ml-2 text-sm font-medium text-gray-600"
                  >
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-indigo-600 hover:underline">
                      Điều khoản dịch vụ
                    </a>{" "}
                    và{" "}
                    <a href="#" className="text-indigo-600 hover:underline">
                      Chính sách bảo mật
                    </a>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-gray-700 font-medium">
                      Tổng thanh toán:
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {
                        paymentPackages.find(
                          (pkg) => pkg.id === selectedPackage
                        )?.amount
                      }{" "}
                      đ
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2 text-center sm:text-right">
                      Bạn sẽ nhận được:
                    </p>
                    <div className="flex items-center justify-center sm:justify-end">
                      <i className="fas fa-coins text-yellow-500 mr-2"></i>
                      <span className="text-xl font-bold">
                        {
                          paymentPackages.find(
                            (pkg) => pkg.id === selectedPackage
                          )?.coins
                        }{" "}
                        xu
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full text-base font-medium shadow-lg hover:from-indigo-700 hover:to-purple-700 transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer"
                >
                  <i className="fas fa-wallet mr-2"></i> Thanh Toán Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Transaction History Modal */}
        <TransactionHistory
          open={showTransactionHistory}
          onClose={() => setShowTransactionHistory(false)}
          transactionHistory={transactionHistory}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          onTransactionDeleted={fetchTransactionHistory}
        />
        {/* Guide Modal */}
        {showGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Hướng Dẫn Nạp Tiền
                </h3>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(90vh-120px)]">
                <div className="bg-gray-50 p-4 overflow-y-auto">
                  <ul className="space-y-2">
                    {guides.map((guide, index) => (
                      <li key={guide.id}>
                        <button
                          onClick={() => setSelectedGuide(index)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                            selectedGuide === index
                              ? "bg-indigo-100 text-indigo-800"
                              : "hover:bg-gray-200 text-gray-700"
                          } cursor-pointer`}
                        >
                          <div className="flex items-center">
                            <i
                              className={`fas ${
                                index === 0
                                  ? "fa-credit-card"
                                  : index === 1
                                  ? "fa-wallet"
                                  : index === 2
                                  ? "fa-university"
                                  : "fa-question-circle"
                              } mr-3`}
                            ></i>
                            <span className="font-medium">{guide.title}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2 p-6 overflow-y-auto">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    {guides[selectedGuide].title}
                  </h4>
                  <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                      {guides[selectedGuide].content}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h5 className="font-medium text-gray-800 mb-3">
                        Các bước thực hiện:
                      </h5>
                      <ol className="list-decimal list-inside space-y-3 text-gray-700">
                        <li>Chọn gói nạp tiền phù hợp với nhu cầu của bạn</li>
                        <li>
                          Chọn phương thức thanh toán{" "}
                          {selectedGuide === 0
                            ? "thẻ tín dụng/ghi nợ"
                            : selectedGuide === 1
                            ? "ví điện tử"
                            : "chuyển khoản ngân hàng"}
                        </li>
                        <li>Nhập thông tin thanh toán theo yêu cầu</li>
                        <li>Kiểm tra lại thông tin và xác nhận thanh toán</li>
                        <li>
                          Đợi hệ thống xử lý giao dịch (thường mất từ vài giây
                          đến vài phút)
                        </li>
                        <li>
                          Kiểm tra số dư xu trong tài khoản sau khi giao dịch
                          hoàn tất
                        </li>
                      </ol>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <i className="fas fa-lightbulb text-indigo-600 mt-1 mr-3"></i>
                        <div>
                          <h5 className="font-medium text-indigo-800 mb-2">
                            Mẹo hữu ích:
                          </h5>
                          <ul className="list-disc list-inside space-y-2 text-indigo-700 text-sm">
                            <li>
                              Nạp tiền với số tiền lớn hơn sẽ được hưởng tỷ lệ
                              khuyến mãi cao hơn
                            </li>
                            <li>
                              Theo dõi các chương trình khuyến mãi định kỳ để
                              được ưu đãi tốt nhất
                            </li>
                            <li>
                              Lưu thông tin thanh toán để tiết kiệm thời gian
                              cho lần sau
                            </li>
                            <li>
                              Kiểm tra kỹ thông tin trước khi xác nhận thanh
                              toán
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden mb-6">
                      <div className="bg-gray-800 px-4 py-2 flex items-center">
                        <i className="fas fa-play-circle text-red-500 mr-2"></i>
                        <span className="text-white font-medium">
                          Video hướng dẫn
                        </span>
                      </div>
                      <div className="bg-gray-200 h-64 flex items-center justify-center">
                        <div className="text-center">
                          <i className="fas fa-video text-gray-400 text-4xl mb-2"></i>
                          <p className="text-gray-600">
                            Video hướng dẫn{" "}
                            {guides[selectedGuide].title.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                      <div className="flex items-start">
                        <i className="fas fa-exclamation-circle text-yellow-500 mt-1 mr-3"></i>
                        <div>
                          <h5 className="font-medium text-yellow-800 mb-2">
                            Lưu ý quan trọng:
                          </h5>
                          <ul className="list-disc list-inside space-y-2 text-yellow-700 text-sm">
                            <li>
                              Đảm bảo bạn đang truy cập trang web chính thức của
                              PlayerDuo
                            </li>
                            <li>
                              Không chia sẻ thông tin thanh toán của bạn với
                              người khác
                            </li>
                            <li>
                              Nếu gặp vấn đề trong quá trình nạp tiền, vui lòng
                              liên hệ hỗ trợ khách hàng
                            </li>
                            <li>
                              Kiểm tra lịch sử giao dịch sau khi nạp tiền để đảm
                              bảo giao dịch thành công
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowGuide(false)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer"
                    >
                      Đã Hiểu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PlayerDuo</h3>
              <p className="text-gray-400 mb-4">
                Nền tảng mạng xã hội trực tuyến dành riêng cho cộng đồng game
                thủ và streamer tại Việt Nam.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Liên Kết</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://readdy.ai/home/ef4865c7-e95b-4f89-8807-3695da440666/d5034761-a46d-452b-9d7d-9489a378c84b"
                    data-readdy="true"
                    className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                  >
                    Trang Chủ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                  >
                    Thuê Người Chơi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                  >
                    Streamer
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                  >
                    Truyện Tranh
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                  >
                    Nạp Tiền
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Hỗ Trợ</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                  >
                    Trung Tâm Hỗ Trợ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                  >
                    Điều Khoản Dịch Vụ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                  >
                    Chính Sách Bảo Mật
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                  >
                    Câu Hỏi Thường Gặp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                  >
                    Liên Hệ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Liên Hệ</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-2 text-gray-400"></i>
                  <span className="text-gray-400">
                    123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                  </span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt mr-2 text-gray-400"></i>
                  <span className="text-gray-400">1900 1234</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2 text-gray-400"></i>
                  <span className="text-gray-400">support@playerduo.net</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 PlayerDuo. Tất cả các quyền được bảo lưu.
              </div>
              <div className="flex space-x-4">
                <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
                <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
                <i className="fab fa-cc-paypal text-2xl text-gray-400"></i>
                <i className="fab fa-cc-apple-pay text-2xl text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal xác nhận thanh toán */}
      {showPaymentConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Xác nhận thanh toán</h3>
            <p>Bạn có chắc chắn muốn nạp gói này không?</p>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowPaymentConfirm(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={confirmPayment}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal đang xử lý */}
      {showProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center">
            <i className="fas fa-spinner fa-spin text-3xl text-indigo-600 mb-4"></i>
            <p className="text-lg font-medium">Đang xử lý thanh toán...</p>
          </div>
        </div>
      )}

      {/* Modal thành công */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center">
            <i className="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
            <p className="text-lg font-bold mb-2">Nạp xu thành công!</p>
            <p className="text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ.</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default Payment;
