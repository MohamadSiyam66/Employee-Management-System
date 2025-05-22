import React, { useEffect, useState } from 'react';
import '../admin/styles/Home.css';
import axios from 'axios';
import { Sun, Users, UserCheck, CalendarDays } from 'lucide-react';

const Home = () => {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [attendanceToday, setAttendanceToday] = useState(0);
    const [leavesToday, setLeavesToday] = useState([]);
    const [leaveCounts, setLeaveCounts] = useState({
        applied: 0,
        approved: 0,
        pending: 0,
        rejected: 0
    });

    const todayDate = new Date().toISOString().split('T')[0]; // '2025-05-15'

useEffect(() => {
    // Fetch total employees
    axios.get('http://localhost:8080/api/employee/employees')
        .then(res => setTotalEmployees(res.data.length))
        .catch(err => console.error(err));
    
    // Fetch attendance data
    axios.get(`http://localhost:8080/api/attendance/attendances/${todayDate}`)
        .then(res => setAttendanceToday(res.data.length))
        .catch(err => console.error(err));

    // Fetch leave data
    axios.get('http://localhost:8080/api/leave/leaves')
        .then(res => {
        const todayLeaves = res.data.filter(item => item.appliedAt === todayDate && item.status === 'APPROVED');
        setLeavesToday(todayLeaves);
        setLeaveCounts(prev => ({ ...prev, applied: res.data.length }));
        })
        .catch(err => console.error(err));
    
    // Fetch leave Status data
    axios.get('http://localhost:8080/api/leave/leaves/APPROVED')
        .then(res => setLeaveCounts(prev => ({ ...prev, approved: res.data.length })))
        .catch(err => console.error(err));
        

    axios.get('http://localhost:8080/api/leave/leaves/PENDING')
        .then(res => setLeaveCounts(prev => ({ ...prev, pending: res.data.length })))
        .catch(err => console.error(err));

    axios.get('http://localhost:8080/api/leave/leaves/REJECTED')
        .then(res => setLeaveCounts(prev => ({ ...prev, rejected: res.data.length })))
        .catch(err => console.error(err));

    }, [todayDate]);

return (
    <div className="admin-dashboard">
    <div className="row">
        <div className="card clock-card">
            <Sun className="icon" />
            <h2>{new Date().toLocaleTimeString()}</h2>
            <p>Realtime Insight</p>
            <p><strong>Today:</strong><br />{new Date().toDateString()}</p>
            <div className="number-box">{attendanceToday} <span>Total Attendance</span></div>
        </div>
        <div className="card total-employee-card">
            <Users className="icon" />
            <h1>{totalEmployees}</h1>
            <h4>Total Employees</h4>
        </div>
    </div>
    <div className="row">
        <div className="card leave-summary-card">
            <CalendarDays className="icon" />
            <h3>Leave Status</h3>
            <div> <b>{leaveCounts.applied}</b>  Leave Applied </div>
            <div> <b>{leaveCounts.approved}</b>  Leave Approved </div>
            <div> <b>{leaveCounts.pending}</b>  Leave Pending </div>
            <div> <b>{leaveCounts.rejected}</b>  Leave Rejected </div>
        </div>
        <div className="card leave-today-card">
            <UserCheck className="icon" />
            <h3>Who is on Leave Today</h3>
            {leavesToday.map((leave, index) => (
                <div key={index} className="leave-name">{leave.employee.fname}</div>
            ))}
        </div>
    </div>
</div>
);
};

export default Home;
