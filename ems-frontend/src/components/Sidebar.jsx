import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, Clock, FileText, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const [role, setRole] = useState('');
    const [name, setName] = useState('');

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
                            <li>
                                <NavLink to="/admin/employee" className="flex items-center gap-2 p-2 hover:text-cyan-600">
                                    <Users size={24} />
                                    <span>Employees</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/attendance" className="flex items-center gap-2 p-2 hover:text-cyan-600">
                                    <Calendar size={24} />
                                    <span>Attendance</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/leave" className="flex items-center gap-2 p-2 hover:text-cyan-600">
                                    <FileText size={24} />
                                    <span>Leave</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/timesheet" className="flex items-center gap-2 p-2 hover:text-cyan-600">
                                    <Clock size={24} />
                                    <span>Timesheet</span>
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
