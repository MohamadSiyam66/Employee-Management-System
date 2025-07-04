import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "./../../api.js";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

const Attendance = () => {
    const [attendances, setAttendances] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchAttendances();
    }, []);

    // Fetch attendance data with loading state
    const fetchAttendances = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/attendance/attendances`);
            setAttendances(response.data);
            setFiltered(response.data);
        } catch (error) {
            toast.error("Error fetching attendance data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced search and filtering
    const handleSearch = (query) => {
        setSearchQuery(query);
        applyFilters(query, selectedDate, statusFilter);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        applyFilters(searchQuery, date, statusFilter);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        applyFilters(searchQuery, selectedDate, status);
    };

    const applyFilters = (search, date, status) => {
        let filteredData = attendances;

        // Search filter
        if (search) {
            filteredData = filteredData.filter(item =>
                `${item.fname} ${item.lname}`.toLowerCase().includes(search.toLowerCase()) ||
                item.empId.toString().includes(search)
            );
        }

        // Date filter
        if (date) {
            filteredData = filteredData.filter(item => item.date === date);
        }

        // Status filter
        if (status !== "all") {
            filteredData = filteredData.filter(item => item.status === status);
        }

        setFiltered(filteredData);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedDate("");
        setStatusFilter("all");
        setFiltered(attendances);
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        const statusStyles = {
            'Present': 'bg-green-100 text-green-800',
            'Absent': 'bg-red-100 text-red-800',
            'Late': 'bg-yellow-100 text-yellow-800',
            'Half Day': 'bg-orange-100 text-orange-800'
        };
        return statusStyles[status] || 'bg-gray-100 text-gray-800';
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Employee ID', 'Name', 'Date', 'Status', 'In Time', 'Out Time'];
        const csvData = filtered.map(item => [
            item.empId,
            `${item.fname} ${item.lname}`,
            item.date,
            item.status,
            item.loggedInTime || 'N/A',
            item.loggedOutTime || 'N/A'
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${cell || ''}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Attendance</h1>
                            <p className="text-gray-600">Monitor and manage employee attendance records</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={exportToCSV}
                                className="bg-gray-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1 sm:gap-2"
                                title="Export CSV"
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">Export CSV</span>
                            </button>
                            <button
                                onClick={fetchAttendances}
                                className="bg-blue-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2"
                                title="Refresh"
                            >
                                <RefreshCw size={16} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Date:</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Status:</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="PRESENT">Present</option>
                                <option value="ABSENT">Absent</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        {(searchQuery || selectedDate || statusFilter !== "all") && (
                            <button
                                onClick={clearFilters}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading attendance data...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Employee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                In Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Out Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filtered.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600">
                                                                {item.fname.charAt(0)}{item.lname.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.fname} {item.lname}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {item.empId}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{item.date}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {item.loggedInTime || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {item.loggedOutTime || 'N/A'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {filtered.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchQuery || selectedDate || statusFilter !== "all" ? "Try adjusting your filters." : "No attendance data available."}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Record Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filtered.length} of {attendances.length} attendance records
                </div>
            </div>
        </div>
    );
};

export default Attendance;
