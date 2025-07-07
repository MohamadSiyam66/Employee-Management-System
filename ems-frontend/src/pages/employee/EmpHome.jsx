import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../api';
import { 
    UserCheck, 
    CalendarDays, 
    Clock, 
    User, 
    Mail, 
    Phone, 
    Edit2, 
    CheckCircle, 
    AlertCircle, 
    XCircle,
    TrendingUp,
    Calendar,
    Target,
    Activity,
    Briefcase,
    MapPin,
    Award,
    BarChart3
} from 'lucide-react';
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
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        fetchEmployee();
        fetchLeaves();
        fetchAttendance();
        fetchTimesheets();
    }, []);

    const fetchEmployee = () => {
        axios.get(`${BASE_URL}/api/employee/employee/${emp}`)
            .then(res => {
                setEmployee(res.data);
            });
    };

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/leave/leaves`);
            const empLeaves = response.data.filter((leave) => String(leave.employee.empId) === String(emp));
            setLeaves(empLeaves);
        } catch {
            toast.error("Error fetching leaves");
        }
    };

    const fetchAttendance = () => {
        axios.get(`${BASE_URL}/api/attendance/attendances`)
            .then(res => {
                const filtered = res.data.filter((att) => String(att.empId) === String(emp));
                setAttendances(filtered);
            });
    };

    const fetchTimesheets = () => {
        axios.get(`${BASE_URL}/api/timesheet/timesheets`)
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
            //custom leave not coming from backend
            const leaveBalance = 10 - approvedLeaves;
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'PRESENT':
            case 'APPROVED':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'ABSENT':
            case 'REJECTED':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'PENDING':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PRESENT':
            case 'APPROVED':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'ABSENT':
            case 'REJECTED':
                return <XCircle size={16} className="text-red-600" />;
            case 'PENDING':
                return <AlertCircle size={16} className="text-yellow-600" />;
            default:
                return <Activity size={16} className="text-gray-600" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
            
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="max-md:hidden w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <User size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Welcome back, {employee.fname} {employee.lname}!
                                </h1>
                                <p className="text-gray-600 text-lg">{employee.designation}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Mail size={14} />
                                        {employee.email}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Phone size={14} />
                                        {employee.phone}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl">
                                <p className="text-sm opacity-90">Today</p>
                                <p className="text-xl font-semibold">
                                    {new Date().toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <UserCheck size={24} className="text-blue-600" />
                                </div>
                                <TrendingUp size={20} className="text-green-500" />
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">Attendance Rate</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{summary.attendancePercent}%</p>
                            <p className="text-sm text-gray-500">
                                {summary.present} present / {summary.totalAttendance} total
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <CalendarDays size={24} className="text-green-600" />
                                </div>
                                <Target size={20} className="text-blue-500" />
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">Leave Balance</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{summary.leaveBalance}</p>
                            <p className="text-sm text-gray-500">
                                {summary.approvedLeaves} approved, {summary.pendingLeaves} pending
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <Clock size={24} className="text-yellow-600" />
                                </div>
                                <BarChart3 size={20} className="text-purple-500" />
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">Avg Work Hours</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{summary.avgWorkHours}h</p>
                            <p className="text-sm text-gray-500">
                                Based on {summary.totalTimesheets} timesheets
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Briefcase size={24} className="text-purple-600" />
                                </div>
                                <Award size={20} className="text-orange-500" />
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Timesheets</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{summary.totalTimesheets}</p>
                            <p className="text-sm text-gray-500">
                                Work records submitted
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Leaves */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                        <CalendarDays size={20} className="text-green-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Recent Leave Requests</h2>
                                </div>
                                <span className="text-sm text-gray-500">{leaves.length} total</span>
                            </div>
                            
                            {leaves.length > 0 ? (
                                <div className="space-y-4">
                                    {leaves.slice(0, 5).map((leave) => (
                                        <div key={leave.leaveId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                {getStatusIcon(leave.status)}
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{leave.leaveType}</h3>
                                                    <p className="text-sm text-gray-600">{leave.startDate} to {leave.endDate}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                                                {leave.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <CalendarDays size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No leave records found</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Attendance History */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <UserCheck size={20} className="text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Attendance History</h2>
                                </div>
                                <span className="text-sm text-gray-500">Last 7 days</span>
                            </div>
                            {attendances.length > 0 ? (
                                <div className="space-y-3">
                                    {attendances.slice(-7).reverse().map((att, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(att.status)}
                                                <span className="font-medium text-gray-900">{att.date}</span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(att.status)}`}>
                                                {att.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <UserCheck size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No attendance records found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpHome;
