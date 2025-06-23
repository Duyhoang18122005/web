import dayjs from 'dayjs';
import React from 'react';

const TransactionHistory = ({ open, onClose, transactionHistory, getStatusColor, getStatusText }) => {
    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                        <h3 className="text-xl font-bold text-gray-800">Lịch Sử Giao Dịch</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="relative">
                                <select className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500 cursor-pointer">
                                    <option>Tất cả giao dịch</option>
                                    <option>Nạp tiền</option>
                                    <option>Sử dụng xu</option>
                                    <option>Hoàn tiền</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <i className="fas fa-chevron-down text-xs"></i>
                                </div>
                            </div>
                            <div className="relative">
                                <select className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500 cursor-pointer">
                                    <option>Tất cả trạng thái</option>
                                    <option>Thành công</option>
                                    <option>Đang xử lý</option>
                                    <option>Thất bại</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <i className="fas fa-chevron-down text-xs"></i>
                                </div>
                            </div>
                            <div className="relative">
                                <select className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500 cursor-pointer">
                                    <option>30 ngày gần đây</option>
                                    <option>90 ngày gần đây</option>
                                    <option>6 tháng gần đây</option>
                                    <option>Tất cả thời gian</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <i className="fas fa-chevron-down text-xs"></i>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày/Giờ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Tiền</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương Thức</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactionHistory.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {dayjs(transaction.dateTime).format('DD/MM/YYYY')}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {dayjs(transaction.dateTime).format('HH:mm:ss')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {transaction.coin?.toLocaleString('vi-VN')} đ
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {transaction.method}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                                                    style={transaction.statusColor ? { backgroundColor: transaction.statusColor + '22', color: transaction.statusColor } : {}}
                                                >
                                                    {transaction.statusText || getStatusText?.(transaction.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-700">
                                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">5</span> của <span className="font-medium">12</span> giao dịch
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                                    Trước
                                </button>
                                <button className="px-3 py-1 border border-gray-300 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium cursor-pointer">
                                    1
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                                    2
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                                    Sau
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition duration-150 ease-in-out mr-3 !rounded-button whitespace-nowrap cursor-pointer">
                                <i className="fas fa-download mr-2"></i> Xuất Excel
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionHistory; 