import { Link } from 'react-router-dom';
import { Home, Users, Calendar, Clock, FileText } from 'lucide-react';

const role = localStorage.getItem("role");

const Sidebar = () => (

    <aside className="sidebar">
        <nav>
            <ul type={ "none"}>
                <li>
                    <Link to="/admin/home" >
                        <Home size={20} />
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to="/admin/employee" >
                        <Users size={20} />
                        <span>Employees</span>
                    </Link>
                </li>
                <li>
                    <Link to="/admin/attendance" >
                        <Calendar size={20} />
                        <span>Attendance</span>
                    </Link>
                </li>
                <li>
                    <Link to="/admin/leave" >
                        <FileText size={20} />
                        <span>Leave</span>
                    </Link>
                </li>
                <li>
                    <Link to="/admin/timesheet" >
                        <Clock size={20} />
                        <span>Timesheet</span>
                    </Link>
                </li>
            </ul>
        </nav>
    </aside>
);

export default Sidebar;
