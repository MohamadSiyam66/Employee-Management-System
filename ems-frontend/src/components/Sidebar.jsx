import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Calendar, Clock, FileText } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        const storedName = localStorage.getItem("userName");
        setRole(storedRole);
        setName(storedName);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <nav>
                <h3>Welcome, {name}</h3>
                <ul>
                    {role === "ADMIN" && (
                        <>
                            <li><NavLink to="/admin/home"><Home size={20} /> <span>Dashboard</span></NavLink></li>
                            <li><NavLink to="/admin/employee"><Users size={20} /> <span>Employees</span></NavLink></li>
                            <li><NavLink to="/admin/attendance"><Calendar size={20} /> <span>Attendance</span></NavLink></li>
                            <li><NavLink to="/admin/leave"><FileText size={20} /> <span>Leave</span></NavLink></li>
                            <li><NavLink to="/admin/timesheet"><Clock size={20} /> <span>Timesheet</span></NavLink></li>
                        </>
                    )}
                    {role === "EMPLOYEE" && (
                        <>
                            <li><NavLink to="/employee/home"><Home size={20} /> <span>Dashboard</span></NavLink></li>
                            <li><NavLink to="/employee/attendance"><Calendar size={20} /> <span>Attendance</span></NavLink></li>
                            <li><NavLink to="/employee/leave"><FileText size={20} /> <span>Leave</span></NavLink></li>
                            <li><NavLink to="/employee/timesheet"><Clock size={20} /> <span>Timesheet</span></NavLink></li>
                        </>
                    )}
                </ul>
            </nav>

            <div className="logout-container">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </aside>
    );
};

export default Sidebar;
