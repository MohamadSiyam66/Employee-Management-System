import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home, Users, Calendar, Clock, FileText, X,
    ChevronDown, ChevronUp, UserRoundPlus, BookOpenCheck
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

    return (
        <aside className={`bg-white h-full md:h-full md:mt-2 shadow-lg z-50 p-2 md:relative fixed top-0 left-0 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:w-64`}>
            
            {/* Close button for mobile */}
            <div className="flex justify-between items-center md:hidden px-4 py-2">
                <h3 className="font-semibold">Welcome, {name}</h3>
                <button onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            <nav>
                <ul className="space-y-2 mt-4">
                    {role === "ADMIN" && (
                        <>
                            <li>
                                <NavLink to="/admin/home" className="flex items-center gap-2 p-2 hover:text-cyan-600">
                                    <Home size={24} />
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>

                            {/* Employees Dropdown */}
                            <li>
                                <button
                                    onClick={() => setEmployeeMenuOpen(!employeeMenuOpen)}
                                    className="flex items-center justify-between w-full p-2 hover:text-cyan-600"
                                >
                                    <div className="flex items-center gap-2">
                                        <Users size={24} />
                                        <span>Employees</span>
                                    </div>
                                    {employeeMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {employeeMenuOpen && (
                                    <ul className="ml-14 mt-1 space-y-1 text-sm text-blue-700 bg-blue-50">
                                        <li>
                                            <NavLink to="/admin/employee" className="block p-1 hover:text-cyan-600">Manage Employees</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/admin/attendance" className="block p-1 hover:text-cyan-600">Attendance</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/admin/leave" className="block p-1 hover:text-cyan-600">Leave</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/admin/timesheet" className="block p-1 hover:text-cyan-600">Timesheet</NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            {/* Onboarding Dropdown */}
                            <li>
                                <button
                                    onClick={() => setOnboardingMenuOpen(!onboardingMenuOpen)}
                                    className="flex items-center justify-between w-full p-2 hover:text-cyan-600"
                                >
                                    <div className="flex items-center gap-2">
                                        <UserRoundPlus size={24} />
                                        <span>Onboarding</span>
                                    </div>
                                    {onboardingMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {onboardingMenuOpen && (
                                    <ul className="ml-14 mt-1 space-y-1 text-sm text-blue-700 bg-blue-50">
                                        <li>
                                            <NavLink to="/admin/onboarding" className="block p-1 hover:text-cyan-600">Candidate Onboard</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/admin/onboarding/files" className="block p-1 hover:text-cyan-600">Candidate Files</NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            {/* Tasks Management */}
                            <li>
                                <NavLink to="/admin/tasks" className="flex items-center gap-2 p-2 hover:text-cyan-600">
                                    <BookOpenCheck size={24} />
                                    <span>Task Management</span>
                                </NavLink>
                            </li>
                        </>
                    )}

                    {role === "EMPLOYEE" && (
                        <>
                            <li>
                                <NavLink to="/employee/home" className="flex items-center gap-2 p-2 hover:text-cyan-600">
                                    <Home size={24} />
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/employee/attendance" className="flex items-center gap-2 p-2 hover:text-cyan-600">
                                    <Calendar size={24} />
                                    <span>Attendance</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/employee/leave" className="flex items-center gap-2 p-2 hover:text-cyan-600">
                                    <FileText size={24} />
                                    <span>Leave</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/employee/timesheet" className="flex items-center gap-2 p-2 hover:text-cyan-600">
                                    <Clock size={24} />
                                    <span>Timesheet</span>
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
