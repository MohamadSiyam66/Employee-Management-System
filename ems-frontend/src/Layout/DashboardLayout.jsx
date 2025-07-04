import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onMenuClick={toggleSidebar} />
            <div className="flex h-screen pt-16">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 overflow-auto p-6 transition-all duration-300">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
