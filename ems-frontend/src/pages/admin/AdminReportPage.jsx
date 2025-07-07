import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../api';
import { Download, Filter, BarChart3, Users, Calendar, Clock, FileText, CheckSquare, TrendingUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import ReportSection from '../../components/reports/ReportSection';
import GlobalDateFilter from '../../components/reports/GlobalDateFilter';
import PerformanceChart from '../../components/reports/PerformanceChart';
import DataTable from '../../components/reports/DataTable';
import FilterControls from '../../components/reports/FilterControls';
import { exportToPDF as exportToPDFUtil } from '../../components/reports/ReportUtils';

import { tabs } from '../../components/reports/ReportUtils';    

const iconMap = {
    Users,
    Calendar,
    Clock,
    FileText,
    CheckSquare,
    TrendingUp,
    BarChart3,
    Download,
    Filter
};

const AdminReportPage = () => {
    // State for all data
    const [attendanceData, setAttendanceData] = useState([]);
    const [timesheetData, setTimesheetData] = useState([]);
    const [leaveData, setLeaveData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [taskData, setTaskData] = useState([]);
    const [employeeTasks, setEmployeeTasks] = useState({}); // { empId: [tasks] }
    const [perfLoading, setPerfLoading] = useState(false);
    
    // Loading states
    const [loading, setLoading] = useState({
        attendance: false,
        timesheet: false,
        leave: false,
        employee: false,
        task: false
    });
    
    // Global date filter
    const [globalDateFilter, setGlobalDateFilter] = useState('all');
    
    // Active tab
    const [activeTab, setActiveTab] = useState('employee');
    
    // Timesheet popup state
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);
    const [showTimesheetPopup, setShowTimesheetPopup] = useState(false);
    
    // Filter states for each section
    const [filters, setFilters] = useState({
        employee: { designation: '', ageRange: '' },
        attendance: { date: '', employeeId: '', month: '', year: '', status: '' },
        timesheet: { date: '', employee: '', month: '', year: '' },
        leave: { employee: '', date: '', month: '', year: '', status: '' },
        task: { date: '', month: '', year: '', status: '' }
    });

    // Fetch all data on component mount
    useEffect(() => {
        fetchAllData();
    }, []);

    // Fetch all employee tasks for performance metrics
    useEffect(() => {
        const fetchEmployeeTasks = async () => {
            setPerfLoading(true);
            try {
                const empIds = employeeData.map(emp => emp.empId || emp.id);
                const results = await Promise.all(
                    empIds.map(empId =>
                        axios.get(`${BASE_URL}/api/task/employee/${empId}`)
                            .then(res => ({ empId, tasks: res.data || [] }))
                            .catch(() => ({ empId, tasks: [] }))
                    )
                );
                const taskMap = {};
                results.forEach(({ empId, tasks }) => {
                    taskMap[empId] = tasks;
                });
                setEmployeeTasks(taskMap);
            } catch {
                setEmployeeTasks({});
            } finally {
                setPerfLoading(false);
            }
        };
        if (employeeData.length > 0) {
            fetchEmployeeTasks();
        }
    }, [employeeData]);

    // Fetch data from all APIs
    const fetchAllData = async () => {
        setLoading({ attendance: true, timesheet: true, leave: true, employee: true, task: true });
        
        try {
            const [attendanceRes, timesheetRes, leaveRes, employeeRes, taskRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/attendance/attendances`),
                axios.get(`${BASE_URL}/api/timesheet/timesheets`),
                axios.get(`${BASE_URL}/api/leave/leaves`),
                axios.get(`${BASE_URL}/api/employee/employees`),
                axios.get(`${BASE_URL}/api/task/tasks`)
            ]);

            setAttendanceData(attendanceRes.data || []);
            setTimesheetData(timesheetRes.data || []);
            setLeaveData(leaveRes.data || []);
            setEmployeeData(employeeRes.data || []);
            setTaskData(taskRes.data || []);
        } catch (error) {
            toast.error('Error fetching data:', error);
            // Set empty arrays on error to prevent crashes
            setAttendanceData([]);
            setTimesheetData([]);
            setLeaveData([]);
            setEmployeeData([]);
            setTaskData([]);
        } finally {
            setLoading({ attendance: false, timesheet: false, leave: false, employee: false, task: false });
        }
    };

    // Get date range based on global filter
    const getDateRange = (filter) => {
        const today = new Date();
        const startDate = new Date();
        
        switch (filter) {
            case 'today':
                return {
                    start: today.toISOString().split('T')[0],
                    end: today.toISOString().split('T')[0]
                };
            case 'week': {
                // Get the start of the current week (Sunday)
                const dayOfWeek = today.getDay();
                startDate.setDate(today.getDate() - dayOfWeek);
                return {
                    start: startDate.toISOString().split('T')[0],
                    end: today.toISOString().split('T')[0]
                };
            }
            case 'month':
                // Get the start of the current month
                startDate.setDate(1);
                return {
                    start: startDate.toISOString().split('T')[0],
                    end: today.toISOString().split('T')[0]
                };
            case 'year':
                // Get the start of the current year
                startDate.setMonth(0, 1);
                return {
                    start: startDate.toISOString().split('T')[0],
                    end: today.toISOString().split('T')[0]
                };
            default:
                return {
                    start: today.toISOString().split('T')[0],
                    end: today.toISOString().split('T')[0]
                };
        }
    };

    // Filter data by date range
    const filterDataByDateRange = (data, dateField = 'date') => {
        if (globalDateFilter === 'all') return data;
        
        const { start, end } = getDateRange(globalDateFilter);
        //console.log(`Filtering ${data.length} records with date range: ${start} to ${end}, field: ${dateField}`);
        
        return data.filter(record => {
            const recordDate = record[dateField];
            if (!recordDate) return false;
            
            // Normalize date format
            let normalizedDate = recordDate;
            if (typeof recordDate === 'string') {
                if (recordDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    normalizedDate = recordDate;
                } else if (recordDate.includes('T')) {
                    // Handle ISO date strings
                    normalizedDate = recordDate.split('T')[0];
                } else {
                    try {
                        const date = new Date(recordDate);
                        if (isNaN(date.getTime())) return false;
                        normalizedDate = date.toISOString().split('T')[0];
                    } catch {
                        return false;
                    }
                }
            } else if (recordDate instanceof Date) {
                normalizedDate = recordDate.toISOString().split('T')[0];
            } else {
                return false;
            }
            
            const isInRange = normalizedDate >= start && normalizedDate <= end;
            return isInRange;
        });
    };

    // Get filtered data for each section
    const getFilteredData = (section) => {
        //console.log(`Getting filtered data for section: ${section}, global filter: ${globalDateFilter}`);
        let data = [];
        switch (section) {
            case 'employee':
                data = employeeData;
                // Apply designation filter
                if (filters.employee.designation) {
                    data = data.filter(emp => 
                        emp.designation?.toLowerCase().includes(filters.employee.designation.toLowerCase())
                    );
                }
                // Apply age filter
                if (filters.employee.ageRange) {
                    const [min, max] = filters.employee.ageRange.split('-').map(Number);
                    data = data.filter(emp => {
                        if (!emp.dob) return false;
                        const age = new Date().getFullYear() - new Date(emp.dob).getFullYear();
                        return age >= min && age <= max;
                    });
                }
                // Apply date filter if not 'all'
                if (globalDateFilter !== 'all') {
                    const { start, end } = getDateRange(globalDateFilter);
                    data = data.filter(emp => {
                        // Use createdAt date field for employee filtering
                        const dateField = emp.createdAt;
                        if (!dateField) return false; // Exclude if no date field
                        let normalizedDate = dateField;
                        if (typeof dateField === 'string') {
                            if (dateField.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                normalizedDate = dateField;
                            } else if (dateField.includes('T')) {
                                normalizedDate = dateField.split('T')[0];
                            } else {
                                try {
                                    const date = new Date(dateField);
                                    if (isNaN(date.getTime())) return false;
                                    normalizedDate = date.toISOString().split('T')[0];
                                } catch {
                                    return false;
                                }
                            }
                        } else if (dateField instanceof Date) {
                            normalizedDate = dateField.toISOString().split('T')[0];
                        } else {
                            return false;
                        }
                        return normalizedDate >= start && normalizedDate <= end;
                    });
                }
                break;
            case 'attendance':
                data = filterDataByDateRange(attendanceData, 'date');
                if (filters.attendance.date) {
                    data = data.filter(record => record.date === filters.attendance.date);
                }
                if (filters.attendance.employeeId) {
                    data = data.filter(record => 
                        record.employeeId?.toString().includes(filters.attendance.employeeId) ||
                        record.empId?.toString().includes(filters.attendance.employeeId)
                    );
                }
                if (filters.attendance.status) {
                    data = data.filter(record => record.status === filters.attendance.status);
                }
                break;
            case 'timesheet':
                data = filterDataByDateRange(timesheetData, 'date');
                if (filters.timesheet.date) {
                    data = data.filter(record => record.date === filters.timesheet.date);
                }
                if (filters.timesheet.employee) {
                    data = data.filter(record => 
                        `${record.fname} ${record.lname}`.toLowerCase().includes(filters.timesheet.employee.toLowerCase())
                    );
                }
                break;
            case 'leave':
                data = filterDataByDateRange(leaveData, 'startDate');
                // Extract employee names from nested employee object in leave data
                data = data.map(leave => {
                    const employee = leave.employee;
                    return {
                        ...leave,
                        employeeName: employee ? `${employee.fname} ${employee.lname}` : 'Unknown Employee',
                        empId: employee ? employee.empId : null
                    };
                });
                if (filters.leave.date) {
                    data = data.filter(record => record.startDate === filters.leave.date);
                }
                if (filters.leave.employee) {
                    data = data.filter(record => 
                        record.employeeName.toLowerCase().includes(filters.leave.employee.toLowerCase())
                    );
                }
                if (filters.leave.status) {
                    data = data.filter(record => record.status === filters.leave.status);
                }
                break;
            case 'task':
                data = filterDataByDateRange(taskData, 'createdAt');
                // Join with employee data to get assigned_to names
                data = data.map(task => {
                    // The task has assignedToId object with empId field
                    const assignedEmployee = employeeData.find(emp => emp.empId === task.assignedToId?.empId);
                    return {
                        ...task,
                        assignedToName: assignedEmployee ? `${assignedEmployee.fname} ${assignedEmployee.lname}` : 'Unassigned'
                    };
                });
                if (filters.task.date) {
                    data = data.filter(record => record.createdAt?.split('T')[0] === filters.task.date);
                }
                if (filters.task.status) {
                    data = data.filter(record => record.status === filters.task.status);
                }
                break;
            default:
                data = [];
        }
        
        //console.log(`Final filtered data for ${section}:`, data.length, 'records');
        return data;
    };

    // Calculate performance metrics with date filtering and real employee tasks
    const calculatePerformanceMetrics = () => {
        const { start, end } = globalDateFilter === 'all' ? 
            { start: '2000-01-01', end: '2100-12-31' } : getDateRange(globalDateFilter);

        // performance data calculatin
        const performanceData = employeeData.map(employee => {
            const employeeId = employee.empId;
            // Attendance metrics - match by employee ID and date range
            const attendanceRecords = filterDataByDateRange(
                attendanceData.filter(record => {
                    const recordEmpId = record.empId;
                    return recordEmpId === employeeId;
                }), 
                'date'
            );

            const totalAttendanceDays = attendanceRecords.length;

            const averageAttendanceDays = totalAttendanceDays > 0 ? 
                (totalAttendanceDays / Math.max(1, new Date().getMonth() + 1)).toFixed(1) : 0;

            // Leave metrics - only APPROVED leaves, match by employee ID and date range
            const approvedLeaveRecords = leaveData.filter(record => {
                const recordEmpId = record.employee && record.employee.empId;
                return recordEmpId === employeeId && record.status === 'APPROVED';
            });

            const totalLeaveDays = approvedLeaveRecords.reduce((sum, record) => sum + (parseInt(record.days) || 0), 0);

            const averageLeaveDays = approvedLeaveRecords.length > 0 ? 
                (totalLeaveDays / approvedLeaveRecords.length).toFixed(1) : 0;

            // employeeTasks for this employee
            const allTasks = (employeeTasks[employeeId] || []);

            // Filter by date range using createdAt
            const taskRecords = allTasks.filter(task => {
                if (!task.createdAt) return false;
                const date = task.createdAt.split('T')[0];
                return date >= start && date <= end;
            });

            const completedTasks = taskRecords.filter(task => task.status === 'COMPLETED').length;
            const totalTasks = taskRecords.length;
            const averageCompletedTasks = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
            return {
                employeeId,
                name: `${employee.fname} ${employee.lname}`,
                designation: employee.designation,
                totalAttendanceDays,
                averageAttendanceDays,
                totalLeaveDays,
                averageLeaveDays,
                totalTasks,
                completedTasks,
                averageCompletedTasks
            };
        });
        return performanceData;
    };

    // Handle timesheet view popup
    const handleViewTimesheet = (timesheet) => {
        setSelectedTimesheet(timesheet);
        setShowTimesheetPopup(true);
    };

    const closeTimesheetPopup = () => {
        setSelectedTimesheet(null);
        setShowTimesheetPopup(false);
    };

    // Export functions
    const exportToExcel = (section, data) => {
        if (!data || data.length === 0) {
            toast.error('No data available to export');
            return;
        }
        let excelData = [];
        switch (section) {
            case 'employee':
                excelData = data.map(emp => ({
                    'Employee ID': emp.empId || emp.id || 'N/A',
                    'Name': `${emp.fname || ''} ${emp.lname || ''}`.trim() || 'N/A',
                    'Email': emp.email || 'N/A',
                    'Phone': emp.phone || 'N/A',
                    'Designation': emp.designation || 'N/A',
                    'Age': emp.dob ? new Date().getFullYear() - new Date(emp.dob).getFullYear() : 'N/A'
                }));
                break;
            case 'attendance':
                excelData = data.map(record => ({
                    'Employee': `${record.fname || ''} ${record.lname || ''}`.trim() || 'N/A',
                    'Date': record.date || 'N/A',
                    'Status': record.status || 'N/A',
                    'Check In': record.loggedInTime || 'N/A',
                    'Check Out': record.loggedOutTime || 'N/A'
                }));
                break;
            case 'timesheet':
                excelData = data.map(record => ({
                    'Employee': `${record.fname || ''} ${record.lname || ''}`.trim() || 'N/A',
                    'Date': record.date || 'N/A',
                    'Work Hours': record.workHours || 'N/A',
                    'Start Time': record.startTime || 'N/A',
                    'End Time': record.endTime || 'N/A',
                    'Work Summary': record.workSummery || record.workSummary || record.work_summary || record.description || 'N/A'
                }));
                break;
            case 'leave':
                excelData = data.map(record => ({
                    'Employee': record.employeeName || 'N/A',
                    'Leave Type': record.leaveType || 'N/A',
                    'Start Date': record.startDate || 'N/A',
                    'End Date': record.endDate || 'N/A',
                    'Days': record.days || 'N/A',
                    'Status': record.status || 'N/A'
                }));
                break;
            case 'task':
                excelData = data.map(record => ({
                    'Name': record.name || 'N/A',
                    'Description': record.description || 'N/A',
                    'Status': record.status || 'N/A',
                    'Priority': record.priority || 'N/A',
                    'Assigned To': record.assignedToName || 'N/A'
                }));
                break;
            case 'performance':
                excelData = data.map(record => ({
                    'Employee Name': record.name || 'N/A',
                    'Designation': record.designation || 'N/A',
                    'Total Attendance Days': record.totalAttendanceDays || 0,
                    'Avg Attendance/Month': record.averageAttendanceDays || 0,
                    'Total Leave Days': record.totalLeaveDays || 0,
                    'Avg Leave Days': record.averageLeaveDays || 0,
                    'Completed Tasks': record.completedTasks || 0,
                    'Task Completion %': record.averageCompletedTasks || 0
                }));
                break;
        }
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `${section} Report`);
        XLSX.writeFile(wb, `${section}-report-${globalDateFilter}.xlsx`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Reports Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-600">Comprehensive reporting and analytics for all employee data</p>
                </div>

                {/* Global Date Filter */}
                <div className="mb-6">
                    <GlobalDateFilter 
                        value={globalDateFilter}
                        onChange={setGlobalDateFilter}
                    />
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex overflow-x-auto scrollbar-hide">
                            <div className="flex space-x-4 sm:space-x-8 min-w-max px-2 sm:px-0">
                                {tabs.map((tab) => {
                                    const Icon = typeof tab.icon === 'string' ? iconMap[tab.icon] : tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                        >
                                            <Icon size={14} className="sm:w-4 sm:h-4" />
                                            <span className="hidden sm:inline">{tab.name}</span>
                                            <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow">
                    {activeTab === 'employee' && (
                        <ReportSection
                            title="Employee Reports"
                            loading={loading.employee}
                            data={getFilteredData('employee')}
                            filters={filters.employee}
                            onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, employee: newFilters }))}
                            onExportPDF={() => exportToPDFUtil('employee', getFilteredData('employee'), globalDateFilter)}
                            onExportExcel={() => exportToExcel('employee', getFilteredData('employee'))}
                            filterConfig={{
                                designation: { type: 'text', placeholder: 'Filter by designation' },
                                ageRange: { 
                                    type: 'select', 
                                    options: [
                                        { value: '', label: 'All Ages' },
                                        { value: '18-25', label: '18-25 years' },
                                        { value: '26-35', label: '26-35 years' },
                                        { value: '36-45', label: '36-45 years' },
                                        { value: '46-55', label: '46-55 years' },
                                        { value: '56+', label: '56+ years' }
                                    ]
                                }
                            }}
                            columns={[
                                { key: 'empId', label: 'Employee ID' },
                                { key: 'name', label: 'Name', render: (emp) => `${emp.fname} ${emp.lname}` },
                                { key: 'email', label: 'Email' },
                                { key: 'phone', label: 'Phone' },
                                { key: 'designation', label: 'Designation' },
                                { key: 'age', label: 'Age', render: (emp) => emp.dob ? new Date().getFullYear() - new Date(emp.dob).getFullYear() : 'N/A' }
                            ]}
                        />
                    )}

                    {activeTab === 'attendance' && (
                        <ReportSection
                            title="Attendance Reports"
                            loading={loading.attendance}
                            data={getFilteredData('attendance')}
                            filters={filters.attendance}
                            onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, attendance: newFilters }))}
                            onExportPDF={() => exportToPDFUtil('attendance', getFilteredData('attendance'), globalDateFilter)}
                            onExportExcel={() => exportToExcel('attendance', getFilteredData('attendance'))}
                            filterConfig={{
                                date: { type: 'date', placeholder: 'Filter by date' },
                                employeeId: { type: 'text', placeholder: 'Filter by employee ID' },
                                status: { 
                                    type: 'select', 
                                    label: 'Status',
                                    options: [
                                        { value: '', label: 'All Status' },
                                        { value: 'PRESENT', label: 'Present' },
                                        { value: 'ABSENT', label: 'Absent' }
                                    ]
                                }
                            }}
                            columns={[
                                { key: 'employee', label: 'Employee', render: (record) => `${record.fname} ${record.lname}` },
                                { key: 'date', label: 'Date' },
                                { key: 'status', label: 'Status' },
                                { key: 'loggedInTime', label: 'Check In', render: (record) => record.loggedInTime || 'N/A' },
                                { key: 'loggedOutTime', label: 'Check Out', render: (record) => record.loggedOutTime || 'N/A' }
                            ]}
                        />
                    )}

                    {activeTab === 'timesheet' && (
                        <ReportSection
                            title="Timesheet Reports"
                            loading={loading.timesheet}
                            data={getFilteredData('timesheet')}
                            filters={filters.timesheet}
                            onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, timesheet: newFilters }))}
                            onExportPDF={() => exportToPDFUtil('timesheet', getFilteredData('timesheet'), globalDateFilter)}
                            onExportExcel={() => exportToExcel('timesheet', getFilteredData('timesheet'))}
                            filterConfig={{
                                date: { type: 'date', placeholder: 'Filter by date' },
                                employee: { type: 'text', placeholder: 'Filter by employee name' }
                            }}
                            columns={[
                                { key: 'employee', label: 'Employee', render: (record) => `${record.fname} ${record.lname}` },
                                { key: 'date', label: 'Date' },
                                { key: 'workHours', label: 'Work Hours' },
                                { key: 'startTime', label: 'Start Time' },
                                { key: 'endTime', label: 'End Time' },
                                { key: 'workSummary', label: 'Work Summary', render: (record) => record.workSummery || record.workSummary || record.work_summary || record.description || 'N/A' },
                                { 
                                    key: 'actions', 
                                    label: 'Actions', 
                                    render: (record) => (
                                        <button
                                            onClick={() => handleViewTimesheet(record)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                                        >
                                            View
                                        </button>
                                    )
                                }
                            ]}
                        />
                    )}

                    {activeTab === 'leave' && (
                        <ReportSection
                            title="Leave Reports"
                            loading={loading.leave}
                            data={getFilteredData('leave')}
                            filters={filters.leave}
                            onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, leave: newFilters }))}
                            onExportPDF={() => exportToPDFUtil('leave', getFilteredData('leave'), globalDateFilter)}
                            onExportExcel={() => exportToExcel('leave', getFilteredData('leave'))}
                            filterConfig={{
                                date: { type: 'date', placeholder: 'Filter by start date' },
                                employee: { type: 'text', placeholder: 'Filter by employee name' },
                                status: { 
                                    type: 'select', 
                                    label: 'Status',
                                    options: [
                                        { value: '', label: 'All Status' },
                                        { value: 'APPROVED', label: 'Approved' },
                                        { value: 'PENDING', label: 'Pending' },
                                        { value: 'REJECTED', label: 'Rejected' }
                                    ]
                                }
                            }}
                            columns={[
                                { key: 'employee', label: 'Employee', render: (record) => `${record.employeeName}` },
                                { key: 'leaveType', label: 'Leave Type' },
                                { key: 'startDate', label: 'Start Date' },
                                { key: 'endDate', label: 'End Date' },
                                { key: 'days', label: 'Days' },
                                { key: 'status', label: 'Status' },
                                { key: 'description', label: 'Description' }
                            ]}
                        />
                    )}

                    {activeTab === 'task' && (
                        <ReportSection
                            title="Task Reports"
                            loading={loading.task}
                            data={getFilteredData('task')}
                            filters={filters.task}
                            onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, task: newFilters }))}
                            onExportPDF={() => exportToPDFUtil('task', getFilteredData('task'), globalDateFilter)}
                            onExportExcel={() => exportToExcel('task', getFilteredData('task'))}
                            filterConfig={{
                                date: { type: 'date', placeholder: 'Filter by creation date' },
                                status: { 
                                    type: 'select', 
                                    label: 'Status',
                                    options: [
                                        { value: '', label: 'All Status' },
                                        { value: 'COMPLETED', label: 'Completed' },
                                        { value: 'PENDING', label: 'Pending' },
                                        { value: 'IN_PROGRESS', label: 'In Progress' }
                                    ]
                                }
                            }}
                            columns={[
                                { key: 'name', label: 'Name' },
                                { key: 'description', label: 'Description', render: (record) => record.description?.substring(0, 50) + '...' },
                                { key: 'status', label: 'Status' },
                                { key: 'priority', label: 'Priority' },
                                { key: 'assignedToName', label: 'Assigned To' },
                                { key: 'createdAt', label: 'Created At', render: (record) => record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A' }
                            ]}
                        />
                    )}

                    {activeTab === 'performance' && (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Performance Reports</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => exportToPDFUtil('performance', calculatePerformanceMetrics(), globalDateFilter)}
                                        className="bg-red-600 text-white py-2 px-2 sm:px-4 rounded-md hover:bg-red-700 flex items-center gap-1 sm:gap-2"
                                        title="Export PDF"
                                    >
                                        <Download size={16} />
                                        <span className="hidden sm:inline">Export PDF</span>
                                    </button>
                                    <button
                                        onClick={() => exportToExcel('performance', calculatePerformanceMetrics())}
                                        className="bg-green-600 text-white py-2 px-2 sm:px-4 rounded-md hover:bg-green-700 flex items-center gap-1 sm:gap-2"
                                        title="Export Excel"
                                    >
                                        <Download size={16} />
                                        <span className="hidden sm:inline">Export Excel</span>
                                    </button>
                                </div>
                            </div>
                            
                            {perfLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                                </div>
                            ) : (
                                <PerformanceChart data={calculatePerformanceMetrics()} />
                            )}
                            
                            <div className="mt-6">
                                <DataTable
                                    data={calculatePerformanceMetrics()}
                                    columns={[
                                        { key: 'name', label: 'Employee Name' },
                                        { key: 'designation', label: 'Designation' },
                                        { key: 'totalAttendanceDays', label: 'Total Attendance Days' },
                                        { key: 'averageAttendanceDays', label: 'Avg Attendance/Month' },
                                        { key: 'totalLeaveDays', label: 'Total Leave Days' },
                                        { key: 'averageLeaveDays', label: 'Avg Leave Days' },
                                        { key: 'completedTasks', label: 'Completed Tasks' },
                                        { key: 'averageCompletedTasks', label: 'Task Completion %' }
                                    ]}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Timesheet Detail Popup */}
            {showTimesheetPopup && selectedTimesheet && (
                <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Timesheet Details</h3>
                                <button
                                    onClick={closeTimesheetPopup}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                                        <p className="text-gray-900">{`${selectedTimesheet.fname} ${selectedTimesheet.lname}`}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <p className="text-gray-900">{selectedTimesheet.date || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Hours</label>
                                        <p className="text-gray-900">{selectedTimesheet.workHours || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <p className="text-gray-900">{selectedTimesheet.startTime || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <p className="text-gray-900">{selectedTimesheet.endTime || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Lunch Out</label>
                                        <p className="text-gray-900">{selectedTimesheet.lunchOutTime || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Lunch In</label>
                                        <p className="text-gray-900">{selectedTimesheet.lunchInTime || 'N/A'}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Summary</label>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-gray-900 whitespace-pre-wrap">
                                            {selectedTimesheet.workSummery || selectedTimesheet.workSummary || selectedTimesheet.work_summary || selectedTimesheet.description || 'No work summary available'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={closeTimesheetPopup}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReportPage; 