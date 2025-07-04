import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Users, UserCheck, CalendarDays, Clock, FileText, 
    TrendingUp, TrendingDown, AlertCircle, CheckCircle, 
    XCircle, Plus, BarChart3, Activity, ArrowUpRight,
    ArrowDownRight, Eye, UserPlus, Calendar, Briefcase
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import ActivityItem from '../../components/dashboard/ActivityItem';
import BASE_URL from '../../api';

const Home = () => {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [prevTotalEmployees, setPrevTotalEmployees] = useState(0);
    const [employeeChange, setEmployeeChange] = useState(0);

    const [attendanceToday, setAttendanceToday] = useState(0);
    const [leavesToday, setLeavesToday] = useState([]);
    const [leaveCounts, setLeaveCounts] = useState({
        applied: 0,
        approved: 0,
        pending: 0,
        rejected: 0
    });
    const [prevPendingLeaves, setPrevPendingLeaves] = useState(0);
    const [pendingLeavesChange, setPendingLeavesChange] = useState(0);

    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attendanceRate, setAttendanceRate] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [prevPendingTasks, setPrevPendingTasks] = useState(0);
    const [pendingTasksChange, setPendingTasksChange] = useState(0);
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);

    const todayDate = new Date().toISOString().split('T')[0];
    
    // use effect start---------------------------------------------
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                let employees = [];
                let attendance = [];
                let leaves = [];
                let tasks = [];

                // Fetch employees
                try {
                    const employeesRes = await axios.get(`${BASE_URL}/api/employee/employees`); //
                    employees = employeesRes.data || [];
                } catch (err) {
                    toast.error("Error fetching employees: " + err.message);
                    employees = [];
                }

                // Fetch attendance
                try {
                    const attendanceRes = await axios.get(`${BASE_URL}/api/attendance/attendances/${todayDate}`);
                    attendance = attendanceRes.data || [];
                } catch (err) {
                    toast.error("Error fetching attendance: " + err.message);
                    attendance = [];
                }

                // Fetch leaves
                try {
                    const leavesRes = await axios.get(`${BASE_URL}/api/leave/leaves`);
                    leaves = leavesRes.data || [];
                } catch (err) {
                    toast.error("Error fetching leaves: " + err.message);
                    leaves = [];
                }

                // Fetch tasks
                try {
                    const tasksRes = await axios.get(`${BASE_URL}/api/task/tasks`);
                    tasks = tasksRes.data || [];
                } catch (err) {
                    toast.error("Error fetching tasks: " + err.message);
                    tasks = [];
                }

                // Calculate stats
                const totalEmployees = employees.length;
                // Only count PRESENT attendances for 'Present Today'
                const presentAttendances = attendance.filter(a => a.status === 'PRESENT');
                const attendanceToday = presentAttendances.length;
                const attendanceRate = totalEmployees > 0 ? (attendanceToday / totalEmployees * 100).toFixed(1) : 0;
                const approvedLeaves = leaves.filter(leave => leave.status === 'APPROVED');
                const pendingLeaves = leaves.filter(leave => leave.status === 'PENDING');
                const rejectedLeaves = leaves.filter(leave => leave.status === 'REJECTED');
                const todayLeaves = leaves.filter(item => 
                    item.appliedAt === todayDate && item.status === 'APPROVED'
                );
                const pendingTasksCount = tasks.filter(task => task.status === 'PENDING').length;
                const activities = generateRecentActivities(leaves, attendance, tasks);

                setTotalEmployees(totalEmployees);
                setAttendanceToday(attendanceToday);
                setLeavesToday(todayLeaves);
                setAttendanceRate(parseFloat(attendanceRate));
                setPendingTasks(pendingTasksCount);
                setLeaveCounts({
                    applied: leaves.length,
                    approved: approvedLeaves.length,
                    pending: pendingLeaves.length,
                    rejected: rejectedLeaves.length
                });
                setRecentActivities(activities);
                setEmployees(employees);

                // --- Fetch previous day's data for change calculation ---
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayDate = yesterday.toISOString().split('T')[0];

                // Previous employees 
                setPrevTotalEmployees(totalEmployees);
                setEmployeeChange(0);

                // Previous pending leaves
                let prevLeaves = [];
                try {
                    const prevLeavesRes = await axios.get(`${BASE_URL}/api/leave/leaves?date=${yesterdayDate}`);
                    prevLeaves = prevLeavesRes.data || [];
                } catch (err) {
                    prevLeaves = [];
                }
                const prevPendingLeaves = prevLeaves.filter(leave => leave.status === 'PENDING').length;
                setPrevPendingLeaves(prevPendingLeaves);
                setPendingLeavesChange(pendingLeaves.length - prevPendingLeaves);

                // Previous pending tasks
                let prevTasks = [];
                try {
                    const prevTasksRes = await axios.get(`${BASE_URL}/api/task/tasks?date=${yesterdayDate}`);
                    prevTasks = prevTasksRes.data || [];
                } catch (err) {
                    prevTasks = [];
                }
                const prevPendingTasks = prevTasks.filter(task => task.status === 'PENDING').length;
                setPrevPendingTasks(prevPendingTasks);
                setPendingTasksChange(pendingTasksCount - prevPendingTasks);

            } catch (error) {
                setError('Failed to load dashboard data. Please check your connection and try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [todayDate]);

// use effect end--------------------------------------------

    const generateRecentActivities = (leaves, attendance, tasks) => {
        const activities = [];
        
        // Add recent leaves
        leaves.slice(0, 5).forEach((leave, index) => {
            if (leave.employee) {
                activities.push({
                    id: `leave-${leave.id || index}`,
                    type: 'leave',
                    title: `${leave.employee.fname} ${leave.employee.lname} applied for leave`,
                    description: `${leave.leaveType} leave from ${leave.startDate} to ${leave.endDate}`,
                    status: leave.status.toLowerCase(),
                    time: new Date(leave.appliedAt).toLocaleDateString(),
                    icon: FileText
                });
            }
        });

        // Add recent attendance
        attendance.slice(0, 3).forEach((att, index) => {
            if (att.employee) {
                const isPresent = att.status === 'PRESENT';
                activities.push({
                    id: `att-${att.attId || index}`,
                    type: 'attendance',
                    title: `${att.employee.fname} ${att.employee.lname} was marked as ${isPresent ? 'Present' : 'Absent'}`,
                    description: isPresent ? `Checked in at ${att.loggedInTime ? new Date(att.loggedInTime).toLocaleTimeString() : ''}` : 'Absent',
                    status: isPresent ? 'present' : 'absent',
                    time: att.date,
                    icon: UserCheck
                });
            }
        });

        // Add recent tasks
        tasks.slice(0, 3).forEach((task, index) => {
            activities.push({
                id: `task-${task.taskId || task.id || index}`,
                type: 'task',
                title: `New task: ${task.name}`,
                description: `Status: ${task.status} | Priority: ${task.priority}`,
                status: task.status.toLowerCase(),
                time: new Date(task.startDate).toLocaleDateString(),
                icon: Briefcase
            });
        });

        return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Today</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Employees"
                    value={totalEmployees}
                    icon={Users}
                    color="text-blue-600"
                    bgColor="bg-blue-100"
                />
                <StatCard
                    title="Present Today"
                    value={attendanceToday}
                    icon={UserCheck}
                    color="text-green-600"
                    bgColor="bg-green-100"
                />
                <StatCard
                    title="Pending Leaves"
                    value={leaveCounts.pending}
                    icon={CalendarDays}
                    color="text-yellow-600"
                    bgColor="bg-yellow-100"
                />
                <StatCard
                    title="Pending Tasks"
                    value={pendingTasks}
                    icon={Briefcase}
                    color="text-purple-600"
                    bgColor="bg-purple-100"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            {recentActivities.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <ActivityItem key={activity.id} activity={activity} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Activity size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">No recent activities</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Employee Timers */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <QuickActionCard
                                title="Add Employee"
                                description="Register new employee"
                                icon={UserPlus}
                                color="bg-blue-500"
                                href="/admin/employee"
                            />
                            <QuickActionCard
                                title="View Reports"
                                description="Generate and view reports"
                                icon={BarChart3}
                                color="bg-green-500"
                                href="/admin/reports"
                            />
                            <QuickActionCard
                                title="Manage Tasks"
                                description="Create and assign tasks"
                                icon={Briefcase}
                                color="bg-purple-500"
                                href="/admin/tasks"
                            />
                            <QuickActionCard
                                title="Attendance"
                                description="View attendance records"
                                icon={UserCheck}
                                color="bg-orange-500"
                                href="/admin/attendance"
                            />
                        </div>
                    </div>

                    {/* Leave Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Summary</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center">
                                    <CheckCircle size={20} className="text-green-600 mr-3" />
                                    <span className="text-sm font-medium text-gray-700">Approved</span>
                                </div>
                                <span className="text-lg font-bold text-green-600">{leaveCounts.approved}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div className="flex items-center">
                                    <AlertCircle size={20} className="text-yellow-600 mr-3" />
                                    <span className="text-sm font-medium text-gray-700">Pending</span>
                                </div>
                                <span className="text-lg font-bold text-yellow-600">{leaveCounts.pending}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div className="flex items-center">
                                    <XCircle size={20} className="text-red-600 mr-3" />
                                    <span className="text-sm font-medium text-gray-700">Rejected</span>
                                </div>
                                <span className="text-lg font-bold text-red-600">{leaveCounts.rejected}</span>
                            </div>
                        </div>
                    </div>

                    {/* On Leave Today */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">On Leave Today</h2>
                        {leavesToday.length > 0 ? (
                            <div className="space-y-3">
                                {leavesToday.map((leave, index) => (
                                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm font-medium text-cyan-600">
                                                {leave.employee?.fname?.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {leave.employee?.fname} {leave.employee?.lname}
                                            </p>
                                            <p className="text-xs text-gray-500">{leave.leaveType}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500">No one is on leave today</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
