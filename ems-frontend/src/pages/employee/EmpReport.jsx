import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import BASE_URL from '../../api';
import { Download, Filter, BarChart3, Users, Calendar, Clock, FileText, TrendingUp, CheckSquare } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReportControls from '../../components/reports/ReportControls';
import ReportTable from '../../components/reports/ReportTable';
import PerformanceSummary from '../../components/reports/PerformanceSummary';

// Import utilities
import { 
    calculateHours, 
    formatTime, 
    getEmployeeName, 
    getEmployeeDesignation,
    employeeReportTypes,
    dateRanges,
    filterDataByDateRange
} from '../../components/reports/ReportUtils';

// Filter out 'week' from date ranges for employee reports
const employeeDateRanges = dateRanges.filter(range => range.id !== 'week');

const EmpReport = () => {
    const [selectedReport, setSelectedReport] = useState('attendance');
    const [dateRange, setDateRange] = useState('today');
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [performanceSummary, setPerformanceSummary] = useState(null);

    // Get current user from localStorage
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');
        
        if (userId) {
            setCurrentUser({
                empId: userId,
                name: userName,
                email: userEmail,
                role: userRole
            });
        }
    }, []);

    // Fetch all employees
    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/employee/employees`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                toast.error('Failed to fetch employee data');
                return [];
            }
        } catch (error) {
            toast.error(`Error fetching employee data: ${error}`);
            return [];
        }
    };

    // Fetch all leaves
    const fetchLeaves = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/leave/leaves`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                toast.error('Failed to fetch leave data');
                return [];
            }
        } catch (error) {
            toast.error(`Error fetching leave data: ${error}`);
            return [];
        }
    };

    // Fetch all attendance data
    const fetchAllAttendance = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/attendance/attendances`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                toast.error('Failed to fetch attendance data');
                return [];
            }
        } catch (error) {
            toast.error(`Error fetching attendance data: ${error}`);
            return [];
        }
    };

    // Fetch attendance data for specific date
    const fetchAttendanceByDate = async (date) => {
        try {
            const response = await fetch(`${BASE_URL}/api/attendance/attendances/${date}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                toast.error('Failed to fetch attendance data for date:', date);
                return [];
            }
        } catch (error) {
            toast.error('Error fetching attendance data for date:', error);
            return [];
        }
    };

    // Fetch all timesheets
    const fetchTimesheets = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/timesheet/timesheets`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                toast.error('Failed to fetch timesheet data');
                return [];
            }
        } catch (error) {
            toast.error(`Error fetching timesheet data: ${error}`);
            return [];
        }
    };

    // Fetch tasks for specific employee
    const fetchTasks = async (empId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/task/employee/${empId}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                toast.error(`Failed to fetch task data for employee: ${empId}`);
                return [];
            }
        } catch (error) {
            toast.error(`Error fetching task data for employee: ${error}`);
            return [];
        }
    };

    // Filter data for current user
    const filterDataForUser = (data, userId) => {
        if (!userId) return [];
        return data.filter(record => {
            if (record.employee && record.employee.empId) {
                return String(record.employee.empId) === String(userId);
            } else if (record.empId) {
                return String(record.empId) === String(userId);
            }
            return false;
        });
    };

    // Filter tasks for current user
    const filterTasksForUser = (tasks) => {
        return tasks || [];
    };

    // Apply date filtering based on selected date or date range
    const applyDateFiltering = (data) => {
        
        if (selectedDate) {
            // Filter by specific date
            const filteredData = data.filter(record => {
                const recordDate = record.date || record.startDate || record.createdAt;
                if (!recordDate) return false;
                
                // Normalize record date to YYYY-MM-DD format
                let normalizedRecordDate = recordDate;
                if (typeof recordDate === 'string') {
                    if (recordDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        normalizedRecordDate = recordDate;
                    } else if (recordDate.includes('T')) {
                        // Handle ISO date strings
                        normalizedRecordDate = recordDate.split('T')[0];
                    } else {
                        try {
                            const date = new Date(recordDate);
                            normalizedRecordDate = date.toISOString().split('T')[0];
                        } catch {
                            return false;
                        }
                    }
                }
                
                return normalizedRecordDate === selectedDate;
            });
            return filteredData;
        } else if (dateRange && dateRange !== 'today') {
            // Filter by date range
            const filteredData = filterDataByDateRange(data, dateRange);
            return filteredData;
        }
        return data;
    };

    const generateReport = async () => {

        if (!currentUser) return;
        
        let allData = [];
        // Fetch all data based on report type
        if (selectedReport === 'attendance') {
            if (selectedDate) {
                allData = await fetchAttendanceByDate(selectedDate);
            } else {
                allData = await fetchAllAttendance();
            }
            // Filter for current user
            const userData = filterDataForUser(allData, currentUser.empId);
            // Apply date filtering
            const filteredUserData = applyDateFiltering(userData);
            setFilteredData(filteredUserData);
        } else if (selectedReport === 'leave') {
            allData = await fetchLeaves();
            // Filter for current user
            const userData = filterDataForUser(allData, currentUser.empId);
            // Apply date filtering
            const filteredUserData = applyDateFiltering(userData);
            setFilteredData(filteredUserData);
        } else if (selectedReport === 'employee') {
            allData = await fetchEmployees();
            // Filter for current user
            const userData = filterDataForUser(allData, currentUser.empId);
            // Apply date filtering
            const filteredUserData = applyDateFiltering(userData);
            setFilteredData(filteredUserData);
        } else if (selectedReport === 'performance') {
            // Fetch all data for performance summary
            const [allAttendance, allLeaves, allTimesheets, allTasks] = await Promise.all([
                fetchAllAttendance(),
                fetchLeaves(),
                fetchTimesheets(),
                fetchTasks(currentUser.empId)
            ]);
            const userAttendance = filterDataForUser(allAttendance, currentUser.empId);
            const userLeaves = filterDataForUser(allLeaves, currentUser.empId);
            const userTimesheets = allTimesheets.filter(record => String(record.employeeId) === String(currentUser.empId));
            const userTasks = filterTasksForUser(allTasks);
            
            // Apply date filtering
            const filteredAttendance = applyDateFiltering(userAttendance);
            const filteredLeaves = applyDateFiltering(userLeaves);
            const filteredTimesheets = applyDateFiltering(userTimesheets);
            const filteredTasks = applyDateFiltering(userTasks);
            
            // Table data (attendance records with hoursWorked)
            const performanceData = filteredAttendance.map(record => ({
                ...record,
                hoursWorked: calculateHours(record.loggedInTime, record.loggedOutTime)
            }));
            setFilteredData(performanceData);
            
            // Calculate summary
            const totalAttendanceDays = filteredAttendance.length;
            const presentDays = filteredAttendance.filter(r => r.status === 'PRESENT').length;
            const absentDays = filteredAttendance.filter(r => r.status === 'ABSENT').length;
            const totalLeaves = filteredLeaves.length;
            const approvedLeaves = filteredLeaves.filter(l => l.status === 'APPROVED').length;
            const pendingLeaves = filteredLeaves.filter(l => l.status === 'PENDING').length;
            const totalTimesheets = filteredTimesheets.length;
            const totalTasks = filteredTasks.length;
            const completedTasks = filteredTasks.filter(t => t.status === 'COMPLETED').length;
            const avgAttendanceHours = filteredAttendance.length > 0 ? (filteredAttendance.reduce((sum, r) => sum + calculateHours(r.loggedInTime, r.loggedOutTime), 0) / filteredAttendance.length).toFixed(2) : 0;
            const avgTimesheetHours = filteredTimesheets.length > 0 ? (filteredTimesheets.reduce((sum, r) => {
                const h = r.workHours && typeof r.workHours === 'string' ? parseFloat(r.workHours.split(':')[0]) + parseFloat(r.workHours.split(':')[1] || 0) / 60 : 0;
                return sum + (isNaN(h) ? 0 : h);
            }, 0) / filteredTimesheets.length).toFixed(2) : 0;
            setPerformanceSummary({
                totalAttendanceDays,
                presentDays,
                absentDays,
                totalLeaves,
                approvedLeaves,
                pendingLeaves,
                totalTimesheets,
                totalTasks,
                completedTasks,
                avgAttendanceHours,
                avgTimesheetHours
            });
        } else if (selectedReport === 'timesheet') {
            const data = await fetchTimesheets();
            const userData = data.filter(record => String(record.employeeId) === String(currentUser.empId));
            // Apply date filtering
            const filteredUserData = applyDateFiltering(userData);
            setFilteredData(filteredUserData);
        } else if (selectedReport === 'task') {
            const data = await fetchTasks(currentUser?.empId);
            //console.log('Task data fetched:', data);
            const userData = filterTasksForUser(data);
            //console.log('Filtered task data:', userData);
            // Apply date filtering
            const filteredUserData = applyDateFiltering(userData);
            //console.log('Date filtered task data:', filteredUserData);
            setFilteredData(filteredUserData);
        }
        
        setLoading(false);
    };

    // Reset all filters
    const resetFilters = () => {
        setSelectedDate('');
        setDateRange('today');
        setFilteredData([]);
        setPerformanceSummary(null);
    };

    // Export to PDF
    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(18);
            doc.text(`${employeeReportTypes.find(t => t.id === selectedReport)?.name}`, 14, 22);
            doc.setFontSize(12);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
            doc.text(`Employee: ${currentUser?.name}`, 14, 42);
            
            // Add filter information
            let filterInfo = '';
            if (selectedDate) {
                filterInfo = `Date: ${selectedDate}`;
            } else if (dateRange && dateRange !== 'today') {
                const rangeInfo = employeeDateRanges.find(r => r.id === dateRange);
                filterInfo = `Date Range: ${rangeInfo?.name}`;
            } else if (dateRange === 'today') {
                filterInfo = `Filter: All Data`;
            }
            if (filterInfo) {
                doc.text(filterInfo, 14, 52);
            }

            // Prepare table data based on report type
            let tableData = [];
            let headers = [];

            if (selectedReport === 'attendance') {
                headers = ['Date', 'Status', 'Hours', 'Check In', 'Check Out'];
                tableData = filteredData.map(record => [
                    record.date || selectedDate || 'N/A',
                    record.status || 'N/A',
                    calculateHours(record.loggedInTime, record.loggedOutTime),
                    formatTime(record.loggedInTime),
                    formatTime(record.loggedOutTime)
                ]);
            } else if (selectedReport === 'leave') {
                headers = ['Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Description'];
                tableData = filteredData.map(record => [
                    record.leaveType || 'N/A',
                    record.startDate || 'N/A',
                    record.endDate || 'N/A',
                    record.days || 'N/A',
                    record.status || 'N/A',
                    record.description || 'N/A'
                ]);
            } else if (selectedReport === 'employee') {
                headers = ['Employee ID', 'Name', 'Email', 'Phone', 'Designation', 'Role'];
                tableData = filteredData.map(record => [
                    record.empId || 'N/A',
                    `${record.fname} ${record.lname}`,
                    record.email || 'N/A',
                    record.phone || 'N/A',
                    record.designation || 'N/A',
                    record.role || 'N/A'
                ]);
            } else if (selectedReport === 'performance') {
                headers = ['Date', 'Hours Worked', 'Status', 'Check In', 'Check Out'];
                tableData = filteredData.map(record => [
                    record.date || 'N/A',
                    calculateHours(record.loggedInTime, record.loggedOutTime),
                    record.status || 'N/A',
                    formatTime(record.loggedInTime),
                    formatTime(record.loggedOutTime)
                ]);
            } else if (selectedReport === 'timesheet') {
                headers = ['Date', 'Start Time', 'End Time', 'Work Hours', 'Lunch Out', 'Lunch In', 'Out', 'In'];
                tableData = filteredData.map(record => [
                    record.date || 'N/A',
                    record.startTime || 'N/A',
                    record.endTime || 'N/A',
                    record.workHours || 'N/A',
                    record.lunchOutTime || 'N/A',
                    record.lunchInTime || 'N/A',
                    record.outTime || 'N/A',
                    record.inTime || 'N/A'
                ]);
            } else if (selectedReport === 'task') {
                headers = ['Task Name', 'Description', 'Status', 'Priority', 'Start Date', 'Due Date', 'Accepting Status'];
                tableData = filteredData.map(record => [
                    record.name || 'N/A',
                    (record.description || 'N/A').substring(0, 30) + '...',
                    record.status || 'N/A',
                    record.priority || 'N/A',
                    record.startDate || 'N/A',
                    record.dueDate || 'N/A',
                    record.acceptingStatus || 'N/A'
                ]);
            }

            // Check if autoTable is available
            if (typeof doc.autoTable === 'function') {
                // Add table
                doc.autoTable({
                    head: [headers],
                    body: tableData,
                    startY: filterInfo ? 60 : 60,
                    styles: {
                        fontSize: 8,
                        cellPadding: 2,
                    },
                    headStyles: {
                        fillColor: [59, 130, 246],
                        textColor: 255,
                        fontStyle: 'bold',
                    },
                });
            } else {
                //create a simple table without autoTable
                let yPosition = filterInfo ? 60 : 60;
                
                // Add headers
                doc.setFontSize(10);
                doc.setFont(undefined, 'bold');
                const colWidths = headers.map(() => 30);
                let xPosition = 14;
                
                headers.forEach((header, index) => {
                    doc.text(header, xPosition, yPosition);
                    xPosition += colWidths[index];
                });
                
                yPosition += 10;
                
                // Add data rows
                doc.setFont(undefined, 'normal');
                tableData.forEach(row => {
                    if (yPosition > 280) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    
                    xPosition = 14;
                    row.forEach((cell, index) => {
                        doc.text(String(cell), xPosition, yPosition);
                        xPosition += colWidths[index];
                    });
                    yPosition += 7;
                });
            }

            // Save the PDF
            const fileName = `${selectedReport}-report-${currentUser?.empId}-${selectedDate || (dateRange === 'today' ? 'all-data' : dateRange) || 'all'}.pdf`;
            doc.save(fileName);
            toast.success('PDF exported successfully!');
        } catch (error) {
            //console.error('Error generating PDF:', error);
            toast.error(`Error generating PDF. Please try again: ${error}`);
        }
    };

    // Export to Excel
    const exportToExcel = () => {
        // Prepare data for Excel based on report type
        let excelData = [];

        if (selectedReport === 'attendance') {
            excelData = filteredData.map(record => ({
                'Date': record.date || selectedDate || 'N/A',
                'Status': record.status || 'N/A',
                'Hours': calculateHours(record.loggedInTime, record.loggedOutTime),
                'Check In': formatTime(record.loggedInTime),
                'Check Out': formatTime(record.loggedOutTime),
                'Designation': getEmployeeDesignation(record)
            }));
        } else if (selectedReport === 'leave') {
            excelData = filteredData.map(record => ({
                'Leave Type': record.leaveType || 'N/A',
                'Start Date': record.startDate || 'N/A',
                'End Date': record.endDate || 'N/A',
                'Days': record.days || 'N/A',
                'Status': record.status || 'N/A',
                'Description': record.description || 'N/A',
                'Applied At': record.appliedAt || 'N/A'
            }));
        } else if (selectedReport === 'employee') {
            excelData = filteredData.map(record => ({
                'Employee ID': record.empId || 'N/A',
                'Name': `${record.fname} ${record.lname}`,
                'Email': record.email || 'N/A',
                'Phone': record.phone || 'N/A',
                'Designation': record.designation || 'N/A',
                'Role': record.role || 'N/A',
                'Date of Birth': record.dob || 'N/A'
            }));
        } else if (selectedReport === 'performance') {
            excelData = filteredData.map(record => ({
                'Date': record.date || 'N/A',
                'Hours Worked': calculateHours(record.loggedInTime, record.loggedOutTime),
                'Status': record.status || 'N/A',
                'Check In': formatTime(record.loggedInTime),
                'Check Out': formatTime(record.loggedOutTime),
                'Efficiency': record.status === 'PRESENT' ? '100%' : '0%'
            }));
        } else if (selectedReport === 'timesheet') {
            excelData = filteredData.map(record => ({
                'Date': record.date || 'N/A',
                'Start Time': record.startTime || 'N/A',
                'End Time': record.endTime || 'N/A',
                'Work Hours': record.workHours || 'N/A',
                'Lunch Out': record.lunchOutTime || 'N/A',
                'Lunch In': record.lunchInTime || 'N/A',
                'Out': record.outTime || 'N/A',
                'In': record.inTime || 'N/A'
            }));
        } else if (selectedReport === 'task') {
            excelData = filteredData.map(record => ({
                'Task Name': record.name || 'N/A',
                'Description': record.description || 'N/A',
                'Status': record.status || 'N/A',
                'Priority': record.priority || 'N/A',
                'Start Date': record.startDate || 'N/A',
                'Due Date': record.dueDate || 'N/A',
                'Accepting Status': record.acceptingStatus || 'N/A',
                'Rejecting Reason': record.rejectingReason || 'N/A'
            }));
        }

        // Create excel
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `${selectedReport} Report`);

        // Save the Excel file
        const fileName = `${selectedReport}-report-${currentUser?.empId}-${selectedDate || (dateRange === 'today' ? 'all-data' : dateRange) || 'all'}.xlsx`;
        XLSX.writeFile(wb, fileName);
        toast.success('Excel file exported successfully!');
    };

    // Handle date change
    const handleDateChange = async (date) => {
        setSelectedDate(date);
        // Clear date range when specific date is selected
        if (date) {
            setDateRange('today');
        }
    };

    // Handle report type change
    const handleReportTypeChange = async (reportType) => {
        setSelectedReport(reportType);
        setLoading(true);
        
        if (reportType === 'attendance') {
            if (selectedDate) {
                const data = await fetchAttendanceByDate(selectedDate);
                const userData = filterDataForUser(data, currentUser?.empId);
                setFilteredData(userData);
            } else {
                const data = await fetchAllAttendance();
                const userData = filterDataForUser(data, currentUser?.empId);
                const filteredUserData = applyDateFiltering(userData);
                setFilteredData(filteredUserData);
            }
        } else if (reportType === 'leave') {
            const data = await fetchLeaves();
            const userData = filterDataForUser(data, currentUser?.empId);
            const filteredUserData = applyDateFiltering(userData);
            setFilteredData(filteredUserData);
        } else if (reportType === 'employee') {
            const data = await fetchEmployees();
            const userData = filterDataForUser(data, currentUser?.empId);
            const filteredUserData = applyDateFiltering(userData);
            setFilteredData(filteredUserData);
        } else if (reportType === 'performance') {
            const [allAttendance, allLeaves, allTimesheets, allTasks] = await Promise.all([
                fetchAllAttendance(),
                fetchLeaves(),
                fetchTimesheets(),
                fetchTasks(currentUser?.empId)
            ]);
            const userAttendance = filterDataForUser(allAttendance, currentUser?.empId);
            const userLeaves = filterDataForUser(allLeaves, currentUser?.empId);
            const userTimesheets = allTimesheets.filter(record => String(record.employeeId) === String(currentUser.empId));
            const userTasks = filterTasksForUser(allTasks);
            
            // Apply date filtering
            const filteredAttendance = applyDateFiltering(userAttendance);
            const filteredLeaves = applyDateFiltering(userLeaves);
            const filteredTimesheets = applyDateFiltering(userTimesheets);
            const filteredTasks = applyDateFiltering(userTasks);
            
            // Add hoursWorked field to each record for performance report
            const performanceData = filteredAttendance.map(record => ({
                ...record,
                hoursWorked: calculateHours(record.loggedInTime, record.loggedOutTime)
            }));
            setFilteredData(performanceData);
            
            // Calculate summary
            const totalAttendanceDays = filteredAttendance.length;
            const presentDays = filteredAttendance.filter(r => r.status === 'PRESENT').length;
            const absentDays = filteredAttendance.filter(r => r.status === 'ABSENT').length;
            const totalLeaves = filteredLeaves.length;
            const approvedLeaves = filteredLeaves.filter(l => l.status === 'APPROVED').length;
            const pendingLeaves = filteredLeaves.filter(l => l.status === 'PENDING').length;
            const totalTimesheets = filteredTimesheets.length;
            const totalTasks = filteredTasks.length;
            const completedTasks = filteredTasks.filter(t => t.status === 'COMPLETED').length;
            const avgAttendanceHours = filteredAttendance.length > 0 ? (filteredAttendance.reduce((sum, r) => sum + calculateHours(r.loggedInTime, r.loggedOutTime), 0) / filteredAttendance.length).toFixed(2) : 0;
            const avgTimesheetHours = filteredTimesheets.length > 0 ? (filteredTimesheets.reduce((sum, r) => {
                const h = r.workHours && typeof r.workHours === 'string' ? parseFloat(r.workHours.split(':')[0]) + parseFloat(r.workHours.split(':')[1] || 0) / 60 : 0;
                return sum + (isNaN(h) ? 0 : h);
            }, 0) / filteredTimesheets.length).toFixed(2) : 0;
            setPerformanceSummary({
                totalAttendanceDays,
                presentDays,
                absentDays,
                totalLeaves,
                approvedLeaves,
                pendingLeaves,
                totalTimesheets,
                totalTasks,
                completedTasks,
                avgAttendanceHours,
                avgTimesheetHours
            });
        } else if (reportType === 'timesheet') {
            const data = await fetchTimesheets();
            const userData = data.filter(record => String(record.employeeId) === String(currentUser.empId));
            const filteredUserData = applyDateFiltering(userData);
            setFilteredData(filteredUserData);
        } else if (reportType === 'task') {
            const data = await fetchTasks(currentUser?.empId);
            const userData = filterTasksForUser(data);
            const filteredUserData = applyDateFiltering(userData);
            setFilteredData(filteredUserData);
        }
        
        setLoading(false);
    };

    // Handle date range change
    const handleDateRangeChange = (range) => {
        setDateRange(range);
        // Clear specific date when date range is selected
        if (range !== 'today') {
            setSelectedDate('');
        }
    };

    useEffect(() => {
        if (currentUser) {
            generateReport();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, dateRange, selectedDate, selectedReport]);

    if (!currentUser) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">Loading user information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reports</h1>
                    <p className="text-gray-600">View and generate your personal reports</p>
                </div>

                {/* Report Controls */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <ReportControls
                        selectedReport={selectedReport}
                        onReportTypeChange={handleReportTypeChange}
                        dateRange={dateRange}
                        onDateRangeChange={handleDateRangeChange}
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        onGenerateReport={generateReport}
                        onResetFilters={resetFilters}
                        loading={loading}
                        reportTypes={employeeReportTypes}
                        dateRanges={employeeDateRanges}
                        showDateFilter={true}
                    />
                </div>

                {/* Performance Summary */}
                {selectedReport === 'performance' && performanceSummary && (
                    <div className="mb-6">
                        <PerformanceSummary summary={performanceSummary} />
                    </div>
                )}

                {/* Report Table */}
                <div className="bg-white rounded-lg shadow-md">
                    <ReportTable
                        filteredData={filteredData}
                        selectedReport={selectedReport}
                        reportTypes={employeeReportTypes}
                        selectedDate={selectedDate}
                        dateRange={dateRange}
                        dateRanges={employeeDateRanges}
                        onExportPDF={exportToPDF}
                        onExportExcel={exportToExcel}
                        getEmployeeName={getEmployeeName}
                        getEmployeeDesignation={getEmployeeDesignation}
                        calculateHours={calculateHours}
                        formatTime={formatTime}
                        isEmployeeView={true}
                    />
                </div>

                {!loading && filteredData.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center mt-6">
                        <p className="text-gray-500">No data found for the selected criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmpReport;