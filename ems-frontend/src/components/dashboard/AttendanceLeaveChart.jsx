import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const AttendanceLeaveChart = ({ attendanceData, leaveData, employees }) => {
    // Debug logging
    console.log('AttendanceLeaveChart - Data received:', {
        employeesCount: employees?.length || 0,
        attendanceCount: attendanceData?.length || 0,
        leaveCount: leaveData?.length || 0
    });

    // Prepare data for the chart
    const chartData = employees.map(employee => {
        const employeeId = employee.empId || employee.id;
        
        // Count attendance records for this employee
        const attendanceCount = attendanceData.filter(att => {
            const attEmpId = att.empId || att.employeeId || att.employee?.empId || att.employee?.id;
            return String(attEmpId) === String(employeeId);
        }).length;
        
        // Count leave records for this employee (including all statuses for better visibility)
        const leaveCount = leaveData.filter(leave => {
            const leaveEmpId = leave.empId || leave.employeeId || leave.employee?.empId || leave.employee?.id;
            return String(leaveEmpId) === String(employeeId);
        }).length;
        
        // Count approved leaves specifically
        const approvedLeaveCount = leaveData.filter(leave => {
            const leaveEmpId = leave.empId || leave.employeeId || leave.employee?.empId || leave.employee?.id;
            return String(leaveEmpId) === String(employeeId) && leave.status === 'APPROVED';
        }).length;
        
        return {
            name: `${employee.fname} ${employee.lname}`,
            attendance: attendanceCount,
            leave: approvedLeaveCount,
            totalLeave: leaveCount,
            employeeId: employeeId
        };
    }).filter(item => item.attendance > 0 || item.leave > 0 || item.totalLeave > 0); // Show employees with any data

    // Debug logging for chart data
    console.log('AttendanceLeaveChart - Processed data:', chartData);

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (chartData.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance vs Leave Overview</h2>
                <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <p className="text-gray-500">No attendance or leave data available</p>
                    <p className="text-xs text-gray-400 mt-2">
                        Employees: {employees?.length || 0} | 
                        Attendance Records: {attendanceData?.length || 0} | 
                        Leave Records: {leaveData?.length || 0}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance vs Leave Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        tick={{ fontSize: 10 }}
                        stroke="#6b7280"
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                        dataKey="attendance" 
                        fill="#10b981" 
                        name="Attendance Days"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                        dataKey="leave" 
                        fill="#f59e0b" 
                        name="Approved Leave Days"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {chartData.reduce((sum, item) => sum + item.attendance, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Attendance Days</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                        {chartData.reduce((sum, item) => sum + item.leave, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Approved Leave Days</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {chartData.length}
                    </div>
                    <div className="text-sm text-gray-500">Employees with Data</div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceLeaveChart; 