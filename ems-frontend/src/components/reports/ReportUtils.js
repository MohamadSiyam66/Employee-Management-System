import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

// Calculate hours worked from loggedInTime and loggedOutTime
export const calculateHours = (loggedInTime, loggedOutTime) => {
    if (!loggedInTime || !loggedOutTime) return 0;
    // If both are in HH:mm or HH:mm:ss format
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(loggedInTime) && /^\d{2}:\d{2}(:\d{2})?$/.test(loggedOutTime)) {
        const [sh, sm] = loggedInTime.split(':').map(Number);
        const [eh, em] = loggedOutTime.split(':').map(Number);
        let diff = (eh * 60 + em) - (sh * 60 + sm);
        if (diff < 0) diff += 24 * 60; // handle overnight
        return (diff / 60).toFixed(2);
    }
    // Otherwise, try to parse as Date
    const login = new Date(loggedInTime);
    const logout = new Date(loggedOutTime);
    if (!isNaN(login) && !isNaN(logout)) {
        const diffMs = logout - login;
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours.toFixed(2);
    }
    return 0;
};

// Format time for display
export const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    // If already in HH:mm or HH:mm:ss format, return HH:mm
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(dateTimeString)) {
        return dateTimeString.slice(0, 5);
    }
    // If ISO string, parse and format
    const date = new Date(dateTimeString);
    if (!isNaN(date)) {
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return 'N/A';
};

// Get employee name from different response formats
export const getEmployeeName = (record) => {
    if (record.employee) {
        return `${record.employee.fname} ${record.employee.lname}`;
    } else if (record.fname && record.lname) {
        return `${record.fname} ${record.lname}`;
    }
    return 'N/A';
};

// Get employee designation from different response formats
export const getEmployeeDesignation = (record) => {
    if (record.employee) {
        return record.employee.designation;
    } else if (record.designation) {
        return record.designation;
    }
    return 'N/A';
};

// Get date range based on selection
export const getDateRange = (dateRange) => {
    const today = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
        case 'today':
            return {
                start: today.toISOString().split('T')[0],
                end: today.toISOString().split('T')[0]
            };
        case 'week':
            // Get the start of the current week (Monday)
            const dayOfWeek = today.getDay();
            const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so subtract 6 to get Monday
            startDate.setDate(today.getDate() - daysToSubtract);
            break;
        case 'month':
            // Get the start of the current month
            startDate.setDate(1);
            break;
        case 'year':
            // Get the start of the current year
            startDate.setMonth(0, 1);
            break;
        default:
            // Default to current week
            const defaultDayOfWeek = today.getDay();
            const defaultDaysToSubtract = defaultDayOfWeek === 0 ? 6 : defaultDayOfWeek - 1;
            startDate.setDate(today.getDate() - defaultDaysToSubtract);
    }
    
    return {
        start: startDate.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
    };
};

// Filter data by date range
export const filterDataByDateRange = (data, dateRange) => {
    const { start, end } = getDateRange(dateRange);
    console.log(`Filtering data by date range: ${start} to ${end}`);
    
    const filteredData = data.filter(record => {
        const recordDate = record.date || record.startDate;
        if (!recordDate) {
            return false;
        }
        
        // Handle different date formats
        let normalizedRecordDate = recordDate;
        if (typeof recordDate === 'string') {
            // If it's already in YYYY-MM-DD format, use as is
            if (recordDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                normalizedRecordDate = recordDate;
            } else {
                // Try to parse other date formats
                try {
                    const date = new Date(recordDate);
                    normalizedRecordDate = date.toISOString().split('T')[0];
                } catch (error) {
                    return false;
                }
            }
        }
        
        return normalizedRecordDate >= start && normalizedRecordDate <= end;
    });
    
    console.log(`Date range filtering: ${data.length} records -> ${filteredData.length} records`);
    return filteredData;
};

// Common report types
export const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', icon: 'Calendar' },
    { id: 'leave', name: 'Leave Report', icon: 'FileText' },
    { id: 'timesheet', name: 'Timesheet Report', icon: 'Clock' },
    { id: 'employee', name: 'Employee Report', icon: 'Users' },
];

export const tabs = [
        { id: 'employee', name: 'Employee Reports', icon: "Users" },
        { id: 'attendance', name: 'Attendance Reports', icon: "Calendar" },
        { id: 'timesheet', name: 'Timesheet Reports', icon: "Clock" },
        { id: 'leave', name: 'Leave Reports', icon: "FileText" },
        { id: 'task', name: 'Task Reports', icon: "CheckSquare" },
        { id: 'performance', name: 'Performance Reports', icon: "TrendingUp" }
];

// Common date ranges
export const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week (Mon-Today)' },
    { id: 'month', name: 'This Month (1st-Today)' },
    { id: 'year', name: 'This Year (Jan-Today)' },
];

// Employee report types
export const employeeReportTypes = [
    { id: 'attendance', name: 'My Attendance', icon: 'Calendar' },
    { id: 'leave', name: 'My Leave History', icon: 'FileText' },
    { id: 'timesheet', name: 'My Timesheet', icon: 'Clock' },
    { id: 'task', name: 'My Tasks', icon: 'CheckSquare' },
    { id: 'performance', name: 'Performance Report', icon: 'TrendingUp' },
];

// PDF Export function
export const exportToPDF = (section, data, globalDateFilter) => {
    console.log(`Exporting ${section} to PDF with ${data.length} records:`, data);
    
    if (!data || data.length === 0) {
        toast.error('No data available to export');
        return;
    }
    
    try {
        // Use landscape orientation for wide tables
        const doc = new jsPDF({ orientation: 'landscape' });
        const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
        
        // Header
        doc.setFontSize(18);
        doc.text(`${sectionName} Report`, 14, 22);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
        doc.text(`Date Filter: ${globalDateFilter}`, 14, 42);
        doc.text(`Total Records: ${data.length}`, 14, 52);
        
        let headers = [];
        let tableData = [];
        
        switch (section) {
            case 'employee':
                headers = ['ID', 'Name', 'Email', 'Phone', 'Designation', 'Age'];
                tableData = data.map(emp => [
                    emp.empId || emp.id || 'N/A',
                    `${emp.fname || ''} ${emp.lname || ''}`.trim() || 'N/A',
                    emp.email || 'N/A',
                    emp.phone || 'N/A',
                    emp.designation || 'N/A',
                    emp.dob ? new Date().getFullYear() - new Date(emp.dob).getFullYear() : 'N/A'
                ]);
                break;
            case 'attendance':
                headers = ['Employee', 'Date', 'Status', 'Check In', 'Check Out'];
                tableData = data.map(record => [
                    `${record.fname || ''} ${record.lname || ''}`.trim() || 'N/A',
                    record.date || 'N/A',
                    record.status || 'N/A',
                    formatTime(record.loggedInTime),
                    formatTime(record.loggedOutTime)
                ]);
                break;
            case 'timesheet':
                headers = ['Employee', 'Date', 'Work Hours', 'Start Time', 'End Time', 'Work Summary'];
                tableData = data.map(record => [
                    `${record.fname || ''} ${record.lname || ''}`.trim() || 'N/A',
                    record.date || 'N/A',
                    record.workHours || 'N/A',
                    record.startTime || 'N/A',
                    record.endTime || 'N/A',
                    record.workSummery || record.workSummary || record.work_summary || record.description || 'N/A'
                ]);
                break;
            case 'leave':
                headers = ['Employee', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status'];
                tableData = data.map(record => [
                    record.employeeName || 'N/A',
                    record.leaveType || 'N/A',
                    record.startDate || 'N/A',
                    record.endDate || 'N/A',
                    record.days || 'N/A',
                    record.status || 'N/A'
                ]);
                break;
            case 'task':
                headers = ['Name', 'Description', 'Status', 'Priority', 'Assigned To'];
                tableData = data.map(record => [
                    record.name || 'N/A',
                    (record.description?.substring(0, 30) || 'N/A') + '...',
                    record.status || 'N/A',
                    record.priority || 'N/A',
                    record.assignedToName || 'N/A'
                ]);
                break;
            case 'performance':
                headers = ['Employee Name', 'Designation', 'Total Attendance Days', 'Avg Attendance/Month', 'Total Leave Days', 'Avg Leave Days', 'Completed Tasks', 'Task Completion %'];
                tableData = data.map(record => [
                    record.name || 'N/A',
                    record.designation || 'N/A',
                    record.totalAttendanceDays || 0,
                    record.averageAttendanceDays || 0,
                    record.totalLeaveDays || 0,
                    record.averageLeaveDays || 0,
                    record.completedTasks || 0,
                    record.averageCompletedTasks || 0
                ]);
                break;
        }
        
        // console.log('PDF Headers:', headers);
        // console.log('PDF Table Data:', tableData);
        
        // Simple text-based table
        let yPosition = 70;
        const lineHeight = 8;
        // Wider columns for landscape
        const colWidth = section === 'performance' ? 32 : 34;
        
        // Draw headers
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(59, 130, 246);
        
        headers.forEach((header, index) => {
            const x = 14 + (index * colWidth);
            doc.text(header, x, yPosition);
        });
        
        doc.setDrawColor(200, 200, 200);
        // Extend line to fit all columns
        doc.line(14, yPosition, 14 + headers.length * colWidth, yPosition);
        yPosition += lineHeight;
        
        // Draw data rows
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        
        tableData.forEach((row, rowIndex) => {
            // Check if we need a new page (landscape height is 210mm)
            if (yPosition > 200) {
                doc.addPage();
                yPosition = 20;
            }
            row.forEach((cell, colIndex) => {
                const x = 14 + (colIndex * colWidth);
                const cellText = String(cell).substring(0, 30); // Allow more text per cell
                doc.text(cellText, x, yPosition);
            });
            yPosition += lineHeight;
            // Add separator line every few rows
            if ((rowIndex + 1) % 5 === 0) {
                doc.setDrawColor(240, 240, 240);
                doc.line(14, yPosition, 14 + headers.length * colWidth, yPosition);
                yPosition += 2;
            }
        });
        
        doc.save(`${section}-report-${globalDateFilter}.pdf`);
        console.log('PDF exported successfully');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error('Error generating PDF. Please try again.');
    }
}; 