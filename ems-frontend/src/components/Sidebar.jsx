import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home, Users, Calendar, Clock, FileText, X,
    ChevronDown, ChevronUp, UserRoundPlus, BookOpenCheck, BarChart3,
    Settings, LogOut, User, Briefcase, TrendingUp, Bell
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [employeeMenuOpen, setEmployeeMenuOpen] = useState(false);
    const [onboardingMenuOpen, setOnboardingMenuOpen] = useState(false);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        const storedName = localStorage.getItem("userName");
        setRole(storedRole);
        setName(storedName);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-transparent bg-opacity-50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed md:relative top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 w-72 md:w-64`}>
                
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center justify-between md:hidden">
                        <h1 className="text-xl font-bold text-white">Rubaai EMS</h1>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            <X size={20} className="text-slate-300" />
                        </button>
                    </div>
                    
                    {/* User Profile */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                                <User size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{name}</h3>
                                <p className="text-sm text-slate-400 capitalize">{role?.toLowerCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {role === "ADMIN" && (
                            <>
                                {/* Dashboard */}
                                <li>
                                    <NavLink 
                                        to="/admin/home" 
                                        className={({ isActive }) => `
                                            flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }
                                        `}
                                    >
                                        <Home size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Dashboard</span>
                                    </NavLink>
                                </li>

                                {/* Employees Section */}
                                <li>
                                    <button
                                        onClick={() => setEmployeeMenuOpen(!employeeMenuOpen)}
                                        className="flex items-center justify-start w-full px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Users size={20} className="group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Employee</span>
                                        </div>
                                        <ChevronDown 
                                            size={16} 
                                            className={`transition-transform duration-200 ml-auto ${employeeMenuOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    
                                    {employeeMenuOpen && (
                                        <ul className="mt-2 ml-8 space-y-1 animate-slideDown">
                                            <li>
                                                <NavLink 
                                                    to="/admin/employee" 
                                                    className={({ isActive }) => `
                                                        block px-4 py-2 rounded-lg text-sm transition-all duration-200
                                                        ${isActive 
                                                            ? 'bg-slate-700 text-white' 
                                                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    Manage Employees
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink 
                                                    to="/admin/attendance" 
                                                    className={({ isActive }) => `
                                                        block px-4 py-2 rounded-lg text-sm transition-all duration-200
                                                        ${isActive 
                                                            ? 'bg-slate-700 text-white' 
                                                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    Attendance
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink 
                                                    to="/admin/leave" 
                                                    className={({ isActive }) => `
                                                        block px-4 py-2 rounded-lg text-sm transition-all duration-200
                                                        ${isActive 
                                                            ? 'bg-slate-700 text-white' 
                                                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    Leave Management
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink 
                                                    to="/admin/timesheet" 
                                                    className={({ isActive }) => `
                                                        block px-4 py-2 rounded-lg text-sm transition-all duration-200
                                                        ${isActive 
                                                            ? 'bg-slate-700 text-white' 
                                                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    Timesheet
                                                </NavLink>
                                            </li>
                                        </ul>
                                    )}
                                </li>

                                {/* Onboarding Section */}
                                <li>
                                    <button
                                        onClick={() => setOnboardingMenuOpen(!onboardingMenuOpen)}
                                        className="flex items-center justify-start w-full px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <UserRoundPlus size={20} className="group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Onboarding</span>
                                        </div>
                                        <ChevronDown 
                                            size={16} 
                                            className={`transition-transform duration-200 ml-auto ${onboardingMenuOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    
                                    {onboardingMenuOpen && (
                                        <ul className="mt-2 ml-8 space-y-1 animate-slideDown">
                                            <li>
                                                <NavLink 
                                                    to="/admin/onboarding" 
                                                    className={({ isActive }) => `
                                                        block px-4 py-2 rounded-lg text-sm transition-all duration-200
                                                        ${isActive 
                                                            ? 'bg-slate-700 text-white' 
                                                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    Candidate Onboard
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink 
                                                    to="/admin/onboarding-files" 
                                                    className={({ isActive }) => `
                                                        block px-4 py-2 rounded-lg text-sm transition-all duration-200
                                                        ${isActive 
                                                            ? 'bg-slate-700 text-white' 
                                                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    Candidate Files
                                                </NavLink>
                                            </li>
                                        </ul>
                                    )}
                                </li>

                                {/* Task Management */}
                                <li>
                                    <NavLink 
                                        to="/admin/tasks" 
                                        className={({ isActive }) => `
                                            flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }
                                        `}
                                    >
                                        <BookOpenCheck size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Task Management</span>
                                    </NavLink>
                                </li>

                                {/* Reports */}
                                <li>
                                    <NavLink 
                                        to="/admin/reports" 
                                        className={({ isActive }) => `
                                            flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }
                                        `}
                                    >
                                        <TrendingUp size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Reports</span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {role === "EMPLOYEE" && (
                            <>
                                {/* Dashboard */}
                                <li>
                                    <NavLink 
                                        to="/employee/home" 
                                        className={({ isActive }) => `
                                            flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }
                                        `}
                                    >
                                        <Home size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Dashboard</span>
                                    </NavLink>
                                </li>

                                {/* Attendance */}
                                <li>
                                    <NavLink 
                                        to="/employee/attendance" 
                                        className={({ isActive }) => `
                                            flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }
                                        `}
                                    >
                                        <Calendar size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Attendance</span>
                                    </NavLink>
                                </li>

                                {/* Leave */}
                                <li>
                                    <NavLink 
                                        to="/employee/leave" 
                                        className={({ isActive }) => `
                                            flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }
                                        `}
                                    >
                                        <FileText size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Leave Management</span>
                                    </NavLink>
                                </li>

                                {/* Timesheet */}
                                <li>
                                    <NavLink 
                                        to="/employee/timesheet" 
                                        className={({ isActive }) => `
                                            flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }
                                        `}
                                    >
                                        <Clock size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Timesheet</span>
                                    </NavLink>
                                </li>

                                {/* Tasks */}
                                <li>
                                    <NavLink 
                                        to="/employee/tasks" 
                                        className={({ isActive }) => `
                                            flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }
                                        `}
                                    >
                                        <BookOpenCheck size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">My Tasks</span>
                                    </NavLink>
                                </li>

                                {/* Reports */}
                                <li>
                                    <NavLink 
                                        to="/employee/report" 
                                        className={({ isActive }) => `
                                            flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }
                                        `}
                                    >
                                        <BarChart3 size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">My Reports</span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="md:hidden p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 group"
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
