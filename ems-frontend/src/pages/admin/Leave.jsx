import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../api";
import { Download, RefreshCw } from "lucide-react";

const Leave = () => {
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaves();
    }, []);

    // get all leaves from the API with loading state
    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/leave/leaves`);
            setLeaves(response.data);
            setFilteredLeaves(response.data);
        } catch (error) {
            console.error("Error fetching leave data:", error);
            setError("Error fetching leave data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced search and filtering
    const handleSearch = (query) => {
        setSearchQuery(query);
        applyFilters(query, statusFilter);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
        applyFilters(searchQuery, status);
    };

    const applyFilters = (search, status) => {
        let filtered = leaves;

        // Search filter
        if (search) {
            filtered = filtered.filter(leave =>
                `${leave.employee.fname} ${leave.employee.lname}`.toLowerCase().includes(search.toLowerCase()) ||
                leave.leaveType.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Status filter
        if (status !== "all") {
            filtered = filtered.filter(leave => leave.status === status);
        }

        setFilteredLeaves(filtered);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setFilteredLeaves(leaves);
    };

    // update leave status with loading state
    const updateLeaveStatus = async (leaveId, newStatus, employeeName) => {
        const confirmed = window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} the leave request for ${employeeName}?`);
        if (!confirmed) return;

        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/api/leave/update/${leaveId}`, {
                status: newStatus.toUpperCase()
            });
            await fetchLeaves();
        } catch (error) {
            console.error("Error updating leave status:", error);
            setError("Error updating leave status: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        const statusStyles = {
            'APPROVED': 'bg-green-100 text-green-800',
            'REJECTED': 'bg-red-100 text-red-800',
            'PENDING': 'bg-yellow-100 text-yellow-800'
        };
        return statusStyles[status] || 'bg-gray-100 text-gray-800';
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Employee Name', 'From Date', 'To Date', 'Days', 'Leave Type', 'Status'];
        const csvData = filteredLeaves.map(leave => [
            `${leave.employee.fname} ${leave.employee.lname}`,
            leave.startDate,
            leave.endDate,
            leave.days,
            leave.leaveType,
            leave.status
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${cell || ''}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `leaves-${new Date().toISOString().split('T')[0]}.csv`);
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave Management</h1>
                            <p className="text-gray-600">Manage and approve employee leave requests</p>
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
                                onClick={fetchLeaves}
                                className="bg-blue-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2"
                                title="Refresh"
                            >
                                <RefreshCw size={16} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

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
                                    placeholder="Search by name or leave type..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Status:</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        {(searchQuery || statusFilter !== "all") && (
                            <button
                                onClick={clearFilters}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Leave Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading leave data...</p>
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
                                                Leave Period
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Days
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Leave Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredLeaves.map((leave) => (
                                            <tr key={leave.leaveId} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600">
                                                                {leave.employee.fname.charAt(0)}{leave.employee.lname.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {leave.employee.fname} {leave.employee.lname}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{leave.startDate}</div>
                                                    <div className="text-sm text-gray-500">to {leave.endDate}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{leave.days} days</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                                        {leave.leaveType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(leave.status)}`}>
                                                        {leave.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {leave.status === "PENDING" ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => updateLeaveStatus(leave.leaveId, "APPROVED", `${leave.employee.fname} ${leave.employee.lname}`)}
                                                                disabled={loading}
                                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => updateLeaveStatus(leave.leaveId, "REJECTED", `${leave.employee.fname} ${leave.employee.lname}`)}
                                                                disabled={loading}
                                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {filteredLeaves.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No leave requests found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchQuery || statusFilter !== "all" ? "Try adjusting your filters." : "No leave requests available."}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Record Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredLeaves.length} of {leaves.length} leave requests
                </div>
            </div>
        </div>
    );
};

export default Leave;
