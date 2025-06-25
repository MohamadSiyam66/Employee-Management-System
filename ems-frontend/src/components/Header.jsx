import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";

const Header = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const empId = localStorage.getItem("userId");

    useEffect(() => {
        if (empId) {
            fetchNotifications(empId);
        }
    }, [empId]);

    const fetchNotifications = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/notifications/user/${id}`);
            setNotifications(res.data || []);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.put(`http://localhost:8080/api/notifications/mark-all-read/${empId}`);
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
        <header>
            <div className="flex flex-row justify-between items-center bg-white p-2 sticky top-0 z-50 shadow-md max-md:w-screen">
                {/* Left section */}
                <div className="flex items-center gap-2">
                    <button onClick={onMenuClick} className="md:hidden block p-1 rounded hover:bg-gray-200">
                        <Menu size={28} />
                    </button>
                    <h1 className="text-lg sm:text-xl md:text-2xl text-cyan-600 font-bold">
                        Rubaai - Employee Management System
                    </h1>
                </div>

                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative bg-cyan-600 text-white p-2 rounded-full"
                    >
                        <Bell size={20} className="inline" />
                        {notifications.filter(n => !n.isRead).length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                                {notifications.filter(n => !n.isRead).length}
                            </span>
                        )}
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 md:w-72 w-60 max-h-80 bg-white border border-gray-300 shadow-lg rounded-md z-50">
                            <div className="p-2 border-b flex justify-between items-center">
                                <span className="font-bold">Notifications</span>
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-sm bg-green-500 py-1 px-2 font-bold rounded-2xl text-white hover:bg-green-600"
                                >
                                    Mark all as read
                                </button>
                            </div>
                            {notifications.filter(n => !n.isRead).length > 0 ? (
                                <ul className="max-h-64 overflow-y-auto">
                                    {notifications
                                        .filter(n => !n.isRead)
                                        .map(n => (
                                            <li key={n.id} className="p-2 text-sm border-b hover:bg-gray-100">
                                                {n.message}
                                                <span className="ml-2 text-xs text-red-500">(new)</span>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p className="p-4 text-sm text-center text-gray-500">No new notifications</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Logout */}
                <button
                    className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-600"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
