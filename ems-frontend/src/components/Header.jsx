import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, X, LogOut } from "lucide-react";
import BASE_URL from "../api";

const Header = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState('');

    const empId = localStorage.getItem("userId");

    useEffect(() => {
        if (empId) {
            fetchNotifications(empId);
        }
        const name = localStorage.getItem("userName");
        setUserName(name);
    }, [empId]);

    const fetchNotifications = async (id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/notifications/user/${id}`);
            setNotifications(res.data || []);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.put(`${BASE_URL}/api/notifications/mark-all-read/${empId}`);
            fetchNotifications(empId);
        } catch (err) {
            console.error("Error marking notifications as read:", err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-2">
                {/* Left section */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onMenuClick} 
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu size={24} className="text-gray-600" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">R</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Rubaai EMS</h1>
                            <p className="text-xs text-gray-500">Employee Management System</p>
                        </div>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4">
                    {/* User info */}
                    <div className="hidden md:flex items-center gap-3 text-sm font-bold text-gray-600">
                        <span>Welcome, {userName}</span>
                    </div>

                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Bell size={20} className="text-gray-600" />
                            {notifications.filter(n => !n.isRead).length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {notifications.filter(n => !n.isRead).length}
                                </span>
                            )}
                        </button>

                        {isOpen && (
                            <>
                                {/* Backdrop */}
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setIsOpen(false)}
                                />
                                
                                {/* Notification dropdown */}
                                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                                            <button
                                                onClick={handleMarkAllAsRead}
                                                className="text-sm bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors"
                                            >
                                                Mark all read
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.filter(n => !n.isRead).length > 0 ? (
                                            <ul>
                                                {notifications
                                                    .filter(n => !n.isRead)
                                                    .map(n => (
                                                        <li key={n.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                            <p className="text-sm text-gray-700">{n.message}</p>
                                                            <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                                                New
                                                            </span>
                                                        </li>
                                                    ))}
                                            </ul>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <Bell size={32} className="mx-auto text-gray-300 mb-2" />
                                                <p className="text-sm text-gray-500">No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="hidden md:flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 group"
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
