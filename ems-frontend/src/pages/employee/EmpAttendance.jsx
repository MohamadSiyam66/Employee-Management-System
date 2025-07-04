import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../api';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle } from 'lucide-react';
import { ToastContainer } from 'react-toastify';

const EmpAttendance = () => {
    const emp = localStorage.getItem("userId");
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);

    // get all attendance records for the employee
    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/attendance/attendances`);
            const emp = localStorage.getItem("userId");
            const filtered = res.data.filter((att) => String(att.empId) === String(emp));
            setRecords(filtered);
        } catch (err) {
            const message = err.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    useEffect(() => {
        // Calculate summary
        if (records.length) {
            const total = records.length;
            const present = records.filter(r => r.status === 'PRESENT').length;
            const absent = records.filter(r => r.status === 'ABSENT').length;
            setSummary({ total, present, absent });
        }
    }, [records]);

    const getStatusBadge = (status) => {
        return status === 'PRESENT' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800';
    };

    const handleQuickAttendance = async (status) => {
        setLoading(true);
        try {
            const now = new Date();
            const date = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' }); // YYYY-MM-DD
            const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Colombo' }); // HH:mm
            const payload = {
                employee: { empId: emp },
                status,
                date,
                ...(status === 'PRESENT' ? { loggedInTime: time } : {})
            };
            await axios.post(`${BASE_URL}/api/attendance/add`, payload);
            toast.success(`Attendance marked as ${status}!`);
            await fetchAttendance();
        } catch (error) {
            const message = error.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Attendance</h1>
                            <p className="text-gray-600">Manage and view your attendance records</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Today</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Days</p>
                                    <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Present</p>
                                    <p className="text-2xl font-bold text-gray-900">{summary.present}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Absent</p>
                                    <p className="text-2xl font-bold text-gray-900">{summary.absent}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Forms */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Quick Attendance Buttons */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                Quick Mark Attendance
                            </h3>
                        </div>
                        <div className="p-6 flex gap-4">
                            <button
                                onClick={() => handleQuickAttendance('PRESENT')}
                                disabled={loading}
                                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <CheckCircle size={20} />
                                Present
                            </button>
                            <button
                                onClick={() => handleQuickAttendance('ABSENT')}
                                disabled={loading}
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <XCircle size={20} />
                                Absent
                            </button>
                        </div>
                    </div>
                </div>

                {/* Attendance Records Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900">Attendance Records</h3>
                        <p className="text-sm text-gray-600 mt-1">Your complete attendance history</p>
                    </div>
                    
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading attendance records...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Login Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Logout Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {records.map((rec, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {rec.attId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {rec.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(rec.status)}`}>
                                                        {rec.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {rec.loggedInTime || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {rec.loggedOutTime || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {records.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Start by marking your attendance for today.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Record Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {records.length} attendance records
                </div>
            </div>
        </div>
    );
};

export default EmpAttendance;