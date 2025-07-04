import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../api";
import { Download, RefreshCw } from "lucide-react";

const Timesheet = () => {
    const [timesheets, setTimesheets] = useState([]);
    const [filteredTimesheets, setFilteredTimesheets] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchTimesheets();
    }, []);

    // get all timesheets from the API
    const fetchTimesheets = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/timesheet/timesheets`);
            //  console.log("Timesheet data received:", response.data);
            setTimesheets(response.data);
            setFilteredTimesheets(response.data);
        } catch (error) {
            console.error("Error fetching timesheet data:", error);
            setTimesheets([]);
            setFilteredTimesheets([]);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced search and filtering
    const handleSearch = (query) => {
        setSearchQuery(query);
        applyFilters(query, selectedDate);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        applyFilters(searchQuery, date);
    };

    const applyFilters = (search, date) => {
        let filtered = timesheets;

        // Search filter
        if (search) {
            filtered = filtered.filter(ts =>
                `${ts.fname || ''} ${ts.lname || ''}`.toLowerCase().includes(search.toLowerCase()) ||
                (ts.timesheetId || ts.id || '').toString().includes(search)
            );
        }

        // Date filter
        if (date) {
            filtered = filtered.filter(ts => ts.date === date);
        }

        setFilteredTimesheets(filtered);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedDate("");
        setFilteredTimesheets(timesheets);
    };

    // Calculate work hours
    const calculateWorkHours = (startTime, endTime) => {
        if (!startTime || !endTime) return 'N/A';
        
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const diffMs = end - start;
        const diffHrs = diffMs / (1000 * 60 * 60);
        
        return diffHrs.toFixed(2) + ' hrs';
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['ID', 'Name', 'Date', 'Start Time', 'End Time', 'Lunch Out', 'Lunch In', 'Work Hours'];
        const csvData = filteredTimesheets.map(ts => [
            ts.timesheetId || ts.id || 'N/A',
            `${ts.fname || ''} ${ts.lname || ''}`,
            ts.date || 'N/A',
            ts.outTime || ts.startTime || 'N/A',
            ts.inTime || ts.endTime || 'N/A',
            ts.lunchOutTime || 'N/A',
            ts.lunchInTime || 'N/A',
            ts.workHours || calculateWorkHours(ts.outTime || ts.startTime, ts.inTime || ts.endTime)
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${cell || ''}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `timesheet-${new Date().toISOString().split('T')[0]}.csv`);
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Timesheet Management</h1>
                            <p className="text-gray-600">Monitor employee work hours and time tracking</p>
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
                                onClick={fetchTimesheets}
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

                        {/* Clear Filters */}
                        {(searchQuery || selectedDate) && (
                            <button
                                onClick={clearFilters}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Timesheet Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading timesheet data...</p>
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
                                                Start Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                End Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Lunch Break
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Work Hours
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Work Summery
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTimesheets.map((ts) => (
                                            <tr key={ts.timesheetId || ts.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600">
                                                                {(ts.fname || '').charAt(0)}{(ts.lname || '').charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {ts.fname || ''} {ts.lname || ''}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {ts.timesheetId || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{ts.date || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{ts.startTime || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{ts.endTime || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {ts.lunchOutTime || 'N/A'} - {ts.lunchInTime || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                        {ts.workHours || calculateWorkHours(ts.outTime || ts.startTime, ts.inTime || ts.endTime)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-black">
                                                        {ts.workSummery}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {filteredTimesheets.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No timesheet records found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchQuery || selectedDate ? "Try adjusting your filters." : "No timesheet data available."}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Record Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredTimesheets.length} of {timesheets.length} timesheet records
                </div>
            </div>
        </div>
    );
};

export default Timesheet;
