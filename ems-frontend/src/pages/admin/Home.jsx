import { useEffect, useState } from 'react';
import axios from 'axios';
import { Sun, Users, UserCheck, CalendarDays } from 'lucide-react';
import BASE_URL from '../../api';

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
    axios.get(`${BASE_URL}/api/employee/employees`)
        .then(res => setTotalEmployees(res.data.length))
        .catch(err => console.error(err));
    
    // Fetch attendance data
    axios.get(`${BASE_URL}/api/attendance/attendances/${todayDate}`)
        .then(res => setAttendanceToday(res.data.length))
        .catch(err => console.error(err));

    // Fetch leave data
    axios.get(`${BASE_URL}/api/leave/leaves`)
        .then(res => {
        const todayLeaves = res.data.filter(item => item.appliedAt === todayDate && item.status === 'APPROVED');
        setLeavesToday(todayLeaves);
        setLeaveCounts(prev => ({ ...prev, applied: res.data.length }));
        })
        .catch(err => console.error(err));
    
    // Fetch leave Status data
    axios.get(`${BASE_URL}/api/leave/leaves/APPROVED`)
        .then(res => setLeaveCounts(prev => ({ ...prev, approved: res.data.length })))
        .catch(err => console.error(err));
        

    axios.get(`${BASE_URL}/api/leave/leaves/PENDING`)
        .then(res => setLeaveCounts(prev => ({ ...prev, pending: res.data.length })))
        .catch(err => console.error(err));

    axios.get(`${BASE_URL}/api/leave/leaves/REJECTED`)
        .then(res => setLeaveCounts(prev => ({ ...prev, rejected: res.data.length })))
        .catch(err => console.error(err));

    }, [todayDate]);

return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-evenly md:mt-10 md:bg-fuchsia-50 md:p-10 md:rounded-2xl">
        <div className="bg-green-200 p-4 border border-black rounded shadow-lg">
            <Sun className="mb-2" />
            <h2>{new Date().toLocaleTimeString()}</h2>
            <p className="text-sm">Realtime Insight</p>
            <p className="text-sm">
            <strong>Today:</strong><br />
            {new Date().toDateString()}
            </p>
            <div className="mt-2 font-bold">
            {attendanceToday} <span className="text-sm font-normal">Total Attendance</span>
            </div>
        </div>
        <div className="bg-blue-200 p-4 border border-black rounded shadow-lg">
            <Users className="mb-2" />
            <div className="font-semibold">
            <div className="text-xl">{totalEmployees}</div>
            <div className="text-sm">Total Employees</div>
            </div>
        </div>
        <div className="bg-cyan-100 p-4 border border-black rounded shadow-lg">
            <CalendarDays className="mb-2" />
            <h3 className="font-semibold">Leave Status</h3>
            <div><b>{leaveCounts.applied}</b> Leave Applied</div>
            <div><b>{leaveCounts.approved}</b> Leave Approved</div>
            <div><b>{leaveCounts.pending}</b> Leave Pending</div>
            <div><b>{leaveCounts.rejected}</b> Leave Rejected</div>
        </div>
        <div className="bg-red-100 p-4 border border-black rounded shadow-lg">
            <div className="flex items-center mb-2">
            <UserCheck className="mr-2" />
            <h3 className="font-semibold">On Leave Today</h3>
            </div>
            {leavesToday.length > 0 ? (
            leavesToday.map((leave, index) => (
                <div key={index} className="text-sm">{leave.employee.fname}</div>
            ))
            ) : (
            <div className="text-sm italic">No one is on leave today.</div>
            )}
        </div>
    </div>

    );
};

export default Home;
