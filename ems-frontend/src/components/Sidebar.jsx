import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, Clock, FileText } from 'lucide-react';

const Sidebar = () => {
    const [role, setRole] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        const storedName = localStorage.getItem("userName");
        setRole(storedRole);
        setName(storedName);
    }, []);


    return (
        <aside className="p-2 ">
            <nav>
                <h3 className="ml-2 font-semibold my-2">Welcome, {name}</h3>
                <ul className="flex flex-row justify-evenly bg-blue-300 rounded-2xl py-2">
                {role === "ADMIN" && (
                    <>
                    <li>
                        <NavLink to="/admin/home" className="flex flex-col items-center hover:text-cyan-600 p-2  border-white border-2 rounded-full active:border-black">
                            <Home size={24} />
                            <span className="text-xs md:block hidden">Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/employee" className="flex flex-col items-center hover:text-cyan-600 p-2  border-white border-2 rounded-full active:border-black">
                            <Users size={24} />
                            <span className="text-xs md:block hidden">Employees</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/attendance" className="flex flex-col items-center hover:text-cyan-600 p-2 border-white border-2 rounded-full active:border-black">
                            <Calendar size={24} />
                            <span className="text-xs md:block hidden">Attendance</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/leave" className="flex flex-col items-center hover:text-cyan-600 p-2  border-white border-2 rounded-full active:border-black">
                            <FileText size={24} />
                            <span className="text-xs md:block hidden">Leave</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/timesheet" className="flex flex-col items-center hover:text-cyan-600 p-2  border-white border-2 rounded-full active:border-black">
                            <Clock size={24} />
                            <span className="text-xs md:block hidden">Timesheet</span>
                        </NavLink>
                    </li>
                    </>
                )}
                {role === "EMPLOYEE" && (
                    <>
                    <li>
                        <NavLink to="/employee/home" className="flex items-center gap-2 p-2 hover:bg-gray-100  border-white border-2 rounded-full active:border-black">
                            <Home size={20} />
                            <span className="text-xs md:block hidden">Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/employee/attendance" className="flex items-center gap-2 p-2 hover:bg-gray-100  border-white border-2 rounded-full active:border-black">
                            <Calendar size={20} />
                            <span className="text-xs md:block hidden">Attendance</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/employee/leave" className="flex items-center gap-2 p-2 hover:bg-gray-100  border-white border-2 rounded-full active:border-black">
                            <FileText size={20} />
                            <span className="text-xs md:block hidden">Leave</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/employee/timesheet" 
                            className="flex items-center gap-2 p-2 hover:bg-gray-100  border-white border-2 rounded-full active:border-black"
                        >
                            <Clock size={20} />
                            <span className="text-xs md:block hidden">Timesheet</span>
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
