import { Download } from 'lucide-react';

const ReportTable = ({ 
    filteredData, 
    selectedReport, 
    reportTypes, 
    selectedDate, 
    dateRange, 
    dateRanges, 
    onExportPDF, 
    onExportExcel,
    getEmployeeName,
    getEmployeeDesignation,
    calculateHours,
    formatTime,
    isEmployeeView = false
}) => {
    //console.log('ReportTable props:', { selectedReport, filteredDataLength: filteredData.length, filteredData });
    if (filteredData.length === 0) return null;

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Detailed {reportTypes.find(t => t.id === selectedReport)?.name}
                        {selectedDate && ` - ${selectedDate}`}
                        {!selectedDate && ` - ${dateRanges.find(r => r.id === dateRange)?.name}`}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={onExportPDF}
                            className="bg-red-600 text-white py-2 px-2 sm:px-4 rounded-md hover:bg-red-700 flex items-center gap-1 sm:gap-2"
                            title="Export PDF"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Export PDF</span>
                        </button>
                        <button
                            onClick={onExportExcel}
                            className="bg-green-600 text-white py-2 px-2 sm:px-4 rounded-md hover:bg-green-700 flex items-center gap-1 sm:gap-2"
                            title="Export Excel"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Export Excel</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {selectedReport === 'attendance' && (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hours
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Check In
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Check Out
                                        </th>
                                    </>
                                )}
                                {selectedReport === 'leave' && (
                                    <>
                                        {!isEmployeeView && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Employee
                                            </th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Leave Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Start Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            End Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Days
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                    </>
                                )}
                                {selectedReport === 'employee' && !isEmployeeView && (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Designation
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                    </>
                                )}
                                {selectedReport === 'performance' && (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hours Worked
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Check In
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Check Out
                                        </th>
                                    </>
                                )}
                                {selectedReport === 'timesheet' && (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Start Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            End Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Work Hours
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lunch Out
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lunch In
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Out
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            In
                                        </th>
                                    </>
                                )}
                                {selectedReport === 'task' && (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Task Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Start Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Due Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Accepting Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Owner
                                        </th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((record, index) => (
                                <tr key={index}>
                                    {selectedReport === 'attendance' && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-blue-600">
                                                            {getEmployeeName(record).substring(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {getEmployeeName(record)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {getEmployeeDesignation(record)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    record.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 
                                                    record.status === 'ABSENT' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {record.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calculateHours(record.loggedInTime, record.loggedOutTime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.date || selectedDate || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatTime(record.loggedInTime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatTime(record.loggedOutTime)}
                                            </td>
                                        </>
                                    )}
                                    {selectedReport === 'leave' && (
                                        <>
                                            {!isEmployeeView && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-green-600">
                                                                {getEmployeeName(record).substring(0, 2).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {getEmployeeName(record)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {getEmployeeDesignation(record)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.leaveType || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.startDate || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.endDate || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.days || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    record.status === 'APPROVED' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : record.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {record.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.description || 'N/A'}
                                            </td>
                                        </>
                                    )}
                                    {selectedReport === 'employee' && !isEmployeeView && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.empId || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-purple-600">
                                                            {`${record.fname} ${record.lname}`.substring(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {`${record.fname} ${record.lname}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.phone || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.designation || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    record.role === 'ADMIN' 
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {record.role || 'N/A'}
                                                </span>
                                            </td>
                                        </>
                                    )}
                                    {selectedReport === 'performance' && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.date || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.hoursWorked || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    record.status === 'APPROVED' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : record.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {record.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatTime(record.loggedInTime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatTime(record.loggedOutTime)}
                                            </td>
                                        </>
                                    )}
                                    {selectedReport === 'timesheet' && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${record.fname || ''} ${record.lname || ''}`.trim() || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.startTime || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.endTime || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.workHours || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.lunchOutTime || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.lunchInTime || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.outTime || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.inTime || 'N/A'}</td>
                                        </>
                                    )}
                                    {selectedReport === 'task' && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="max-w-xs truncate" title={record.description || 'N/A'}>
                                                    {record.description || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    record.status === 'COMPLETED' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : record.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : record.status === 'IN_PROGRESS'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {record.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    record.priority === 'HIGH' 
                                                        ? 'bg-red-100 text-red-800'
                                                        : record.priority === 'MEDIUM'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {record.priority || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.startDate || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.dueDate || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    record.acceptingStatus === 'ACCEPTED' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : record.acceptingStatus === 'REJECTED'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {record.acceptingStatus || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.ownerId ? `${record.ownerId.fname} ${record.ownerId.lname}` : 'N/A'}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportTable; 