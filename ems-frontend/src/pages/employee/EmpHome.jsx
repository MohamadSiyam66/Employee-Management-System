import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../api';
import { UserCheck, CalendarDays, Clock, User, Mail, Phone, Edit2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import TimerComponent from '../../components/TimerComponent';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmpHome = () => {
    const emp = localStorage.getItem('userId');
    const [employee, setEmployee] = useState({});
    const [leaves, setLeaves] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [timesheets, setTimesheets] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: ''
    });
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        fetchEmployee();
        fetchLeaves();
        fetchAttendance();
        fetchTimesheets();
    }, []);

    const fetchEmployee = () => {
        axios.get(`${BASE_URL}/api/employee/employee/${emp}`)  //  ${BASE_URL}
            .then(res => {
                setEmployee(res.data);
                setFormData({
                    username: res.data.username || '',
                    password: res.data.password || '',
                    email: res.data.email || '',
                    phone: res.data.phone || ''
                });
            });
    };

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/leave/leaves`); // ${BASE_URL}
            const empLeaves = response.data.filter((leave) => String(leave.employee.empId) === String(emp));
            setLeaves(empLeaves);
        } catch  {
            toast.error("Error fetching leaves");
        }
    };

    const fetchAttendance = () => {
        axios.get(`${BASE_URL}/api/attendance/attendances`) // ${BASE_URL}
            .then(res => {
                const filtered = res.data.filter((att) => String(att.empId) === String(emp));
                setAttendances(filtered);
            });
    };

    const fetchTimesheets = () => {
        axios.get(`${BASE_URL}/api/timesheet/timesheets`) // ${BASE_URL}
            .then(res => {
                const filtered = res.data.filter((t) => String(t.employeeId) === String(emp));
                setTimesheets(filtered);
            });
    };

    useEffect(() => {
        if (attendances.length || leaves.length || timesheets.length) {
            const totalAttendance = attendances.length;
            const present = attendances.filter(a => a.status === 'PRESENT').length;
            const absent = attendances.filter(a => a.status === 'ABSENT').length;
            const attendancePercent = totalAttendance > 0 ? Math.round((present / totalAttendance) * 100) : 0;
            const totalLeaves = leaves.length;
            const approvedLeaves = leaves.filter(l => l.status === 'APPROVED').length;
            const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;
            const leaveBalance = 20 - approvedLeaves;
            const totalTimesheets = timesheets.length;
            const avgWorkHours = timesheets.length > 0 ? (timesheets.reduce((sum, t) => {
                const h = t.workHours && typeof t.workHours === 'string' ? parseFloat(t.workHours.split(':')[0]) + parseFloat(t.workHours.split(':')[1] || 0) / 60 : 0;
                return sum + (isNaN(h) ? 0 : h);
            }, 0) / timesheets.length).toFixed(2) : 0;
            setSummary({
                totalAttendance,
                present,
                absent,
                attendancePercent,
                totalLeaves,
                approvedLeaves,
                pendingLeaves,
                leaveBalance,
                totalTimesheets,
                avgWorkHours
            });
        }
    }, [attendances, leaves, timesheets]);

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const updateEmployee = () => {
        axios.put(`${BASE_URL}/api/employee/update/${emp}`, {
            ...employee,
            ...formData
        }).then(() => {
            toast.success("Profile updated!");
            fetchEmployee();
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-8">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
                    <p className="text-gray-600">Welcome, {employee.fname} {employee.lname}!</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Today</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            {/* Stat Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Attendance"
                        value={`${summary.present} / ${summary.totalAttendance}`}
                        icon={UserCheck}
                        subtitle={`Attendance %: ${summary.attendancePercent}%`}
                        color="text-blue-700"
                        bgColor="bg-blue-200"
                    />
                    <StatCard
                        title="Leaves"
                        value={summary.totalLeaves}
                        icon={CalendarDays}
                        subtitle={`Approved: ${summary.approvedLeaves} | Pending: ${summary.pendingLeaves}`}
                        color="text-green-700"
                        bgColor="bg-green-200"
                    />
                    <StatCard
                        title="Timesheets"
                        value={summary.totalTimesheets}
                        icon={Clock}
                        subtitle={`Avg. Work Hours: ${summary.avgWorkHours}`}
                        color="text-yellow-700"
                        bgColor="bg-yellow-200"
                    />
                </div>
            )}
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timer Component - Full Width */}
                <div className="lg:col-span-3">
                    <TimerComponent 
                        employeeId={emp} 
                        employeeName={`${employee.fname} ${employee.lname}`}
                    />
                </div>
                
                {/* Info & Recent */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <User size={22} className="text-blue-600" />
                            <span className="font-bold text-blue-700">Basic Info</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div><b>Name:</b> {employee.fname} {employee.lname}</div>
                            <div><b>Designation:</b> {employee.designation}</div>
                            <div className="flex items-center gap-2"><Mail size={16} /> {employee.email}</div>
                            <div className="flex items-center gap-2"><Phone size={16} /> {employee.phone}</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CalendarDays size={22} className="text-green-600" />
                            <span className="font-bold text-green-700">Recent Leaves</span>
                        </div>
                        {leaves.length > 0 ? leaves.slice(0, 5).map((leave) => (
                            <div key={leave.leaveId} className="mb-3 border-b pb-2 border-gray-200">
                                <div className="flex items-center gap-2">
                                    {leave.status === 'APPROVED' && <CheckCircle size={16} className="text-green-600" />}
                                    {leave.status === 'PENDING' && <AlertCircle size={16} className="text-yellow-600" />}
                                    {leave.status === 'REJECTED' && <XCircle size={16} className="text-red-600" />}
                                    <b>{leave.leaveType}</b> <span className="text-xs text-gray-500">({leave.status})</span>
                                </div>
                                <div className="text-sm text-gray-600">{leave.startDate} to {leave.endDate}</div>
                            </div>
                        )) : <div className="text-gray-500">No leave records found.</div>}
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <UserCheck size={22} className="text-purple-600" />
                            <span className="font-bold text-purple-700">Last 5 Days Attendance</span>
                        </div>
                        {attendances.length > 0 ? attendances.slice(-5).map((att, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">{att.date}:</span>
                                <span className={att.status === 'PRESENT' ? 'text-green-700' : att.status === 'ABSENT' ? 'text-red-600' : 'text-yellow-600'}>{att.status}</span>
                            </div>
                        )) : <div className="text-gray-500">No attendance records found.</div>}
                    </div>
                </div>
                {/* Update Form */}
                <div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <form onSubmit={updateEmployee}>
                            
                                <div className="flex items-center gap-3 mb-4">
                                    <Edit2 size={22} className="text-red-600" />
                                    <span className="font-bold text-red-700">Update Info</span>
                                </div>
                                <input
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="mb-3 p-2 w-full border rounded"
                                />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="mb-3 p-2 w-full border rounded"
                                />
                                <input
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mb-3 p-2 w-full border rounded"
                                />
                                <input
                                    name="phone"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="mb-3 p-2 w-full border rounded"
                                />

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700"
                                >
                                Update
                                </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpHome;
