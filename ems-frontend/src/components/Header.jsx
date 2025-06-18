import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const Header = ({ onMenuClick }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <header>
            <div className="flex flex-row justify-between items-center bg-white p-2 sticky top-0 z-50 shadow-md max-md:w-screen">
                {/* Left section: Hamburger on mobile + Title */}
                <div className="flex items-center gap-2">
                    {/* Hamburger icon visible only on small screens */}
                    <button 
                        onClick={onMenuClick} 
                        className="md:hidden block p-1 rounded hover:bg-gray-200"
                    >
                        <Menu size={28} />
                    </button>
                    <h1 className="text-lg sm:text-xl md:text-2xl text-cyan-600 font-bold">
                        Rubaai - Employee Management System
                    </h1>
                </div>

                {/* Right section: Logout */}
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
