import React from 'react';
import {
    BarChart,Bar,XAxis,YAxis,
    CartesianGrid,Tooltip,Legend,
    ResponsiveContainer, LineChart,
    Line,PieChart,Pie,Cell
} from 'recharts';

const PerformanceChart = ({ data }) => {
    // Prepare data for charts
    const attendanceData = data.map(emp => ({
        name: emp.name,
        attendance: emp.totalAttendanceDays,
        leave: emp.totalLeaveDays,
        tasks: emp.completedTasks
    }));

    const performanceData = data.map(emp => ({
        name: emp.name,
        attendance: parseFloat(emp.averageAttendanceDays),
        leave: parseFloat(emp.averageLeaveDays),
        taskCompletion: parseFloat(emp.averageCompletedTasks)
    }));

    // Calculate summary statistics
    const totalEmployees = data.length;
    const avgAttendance = data.reduce((sum, emp) => sum + emp.totalAttendanceDays, 0) / totalEmployees;
    const avgLeave = data.reduce((sum, emp) => sum + emp.totalLeaveDays, 0) / totalEmployees;
    const avgTaskCompletion = data.reduce((sum, emp) => sum + parseFloat(emp.averageCompletedTasks), 0) / totalEmployees;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h4 className="text-sm font-medium text-gray-500">Total Employees</h4>
                    <p className="text-2xl font-bold text-blue-600">{totalEmployees}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h4 className="text-sm font-medium text-gray-500">Avg Attendance Days</h4>
                    <p className="text-2xl font-bold text-green-600">{avgAttendance.toFixed(1)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h4 className="text-sm font-medium text-gray-500">Avg Leave Days</h4>
                    <p className="text-2xl font-bold text-orange-600">{avgLeave.toFixed(1)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h4 className="text-sm font-medium text-gray-500">Avg Task Completion %</h4>
                    <p className="text-2xl font-bold text-purple-600">{avgTaskCompletion.toFixed(1)}%</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance vs Leave Chart */}
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Attendance vs Leave Days</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={attendanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                                tick={{ fontSize: 10 }}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="attendance" fill="#0088FE" name="Attendance Days" />
                            <Bar dataKey="leave" fill="#00C49F" name="Leave Days" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Task Completion Chart */}
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Task Completion Rate</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                                tick={{ fontSize: 10 }}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="taskCompletion" fill="#FFBB28" name="Task Completion %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-white p-4 rounded-lg shadow border">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Performance Trends</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                            tick={{ fontSize: 10 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="attendance" 
                            stroke="#0088FE" 
                            name="Avg Attendance/Month"
                            strokeWidth={2}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="leave" 
                            stroke="#00C49F" 
                            name="Avg Leave Days"
                            strokeWidth={2}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="taskCompletion" 
                            stroke="#FFBB28" 
                            name="Task Completion %"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Attendance */}
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Top Attendance Performers</h4>
                    <div className="space-y-2">
                        {data
                            .sort((a, b) => b.totalAttendanceDays - a.totalAttendanceDays)
                            .slice(0, 5)
                            .map((emp, index) => (
                                <div key={emp.employeeId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                                        <span className="text-sm font-medium">{emp.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">{emp.totalAttendanceDays} days</span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Top Task Completion */}
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Top Task Performers</h4>
                    <div className="space-y-2">
                        {data
                            .sort((a, b) => parseFloat(b.averageCompletedTasks) - parseFloat(a.averageCompletedTasks))
                            .slice(0, 5)
                            .map((emp, index) => (
                                <div key={emp.employeeId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                                        <span className="text-sm font-medium">{emp.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-purple-600">{emp.averageCompletedTasks}%</span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceChart; 