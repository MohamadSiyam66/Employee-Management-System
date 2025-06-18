import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../api";

const Leave = () => {
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaves();
        
    }, []);

    const fetchLeaves = () => {
        axios.get(`${BASE_URL}/api/leave/leaves`)
            .then((response) => {
                setLeaves(response.data);
                setFilteredLeaves(response.data);
            })
            .catch((error) => {
                console.error("Error fetching leave data:", error);
                setError("Error fetching leave data: " + error.message);
            });
    };

    const handleStatusChange = (e) => {
        const selectedStatus = e.target.value;
        setStatusFilter(selectedStatus);
        if (selectedStatus === "") {
            setFilteredLeaves(leaves);
        } else {
            const filtered = leaves.filter(leave => leave.status === selectedStatus);
            setFilteredLeaves(filtered);
        }
    };

    const updateLeaveStatus = (leaveId, newStatus) => {
        axios.put(`${BASE_URL}/api/leave/update/${leaveId}`, {
            status: newStatus.toUpperCase()
        })
        .then(() => {
            fetchLeaves();
        })
        .catch((error) => {
            console.error("Error updating leave status:", error);
            setError("Error updating leave status: " + error.message);
        });
    };


    return (
        <div className="md:p-6 bg-white shadow-xl rounded-lg mx-auto">
        <h3 className="text-2xl font-bold text-cyan-700 mb-4 text-center">Leave Management</h3>

        {error && <p className="text-red-600 font-semibold mb-4 text-center">{error}</p>}

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-700 font-medium">Status:</label>
            <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="border border-gray-300 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] max-md:max-w-[300px]">
            <table className="min-w-full text-sm text-left border border-gray-300 shadow-sm rounded overflow-hidden">
                <thead className="bg-cyan-600 text-white sticky top-0 z-10">
                <tr>
                    <th className="px-4 py-2">Employee Name</th>
                    <th className="px-4 py-2">From</th>
                    <th className="px-4 py-2">To</th>
                    <th className="px-4 py-2">Days</th>
                    <th className="px-4 py-2">Leave Type</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                </tr>
                </thead>
                <tbody className="bg-white text-gray-700">
                {filteredLeaves.map((leave) => (
                    <tr key={leave.leaveId} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{leave.employee.fname} {leave.employee.lname}</td>
                    <td className="px-4 py-2">{leave.startDate}</td>
                    <td className="px-4 py-2">{leave.endDate}</td>
                    <td className="px-4 py-2">{leave.days}</td>
                    <td className="px-4 py-2">{leave.leaveType}</td>
                    <td className="px-4 py-2 font-semibold">
                        <span className={
                        leave.status === "APPROVED" ? "text-green-600" :
                        leave.status === "REJECTED" ? "text-red-600" :
                        "text-yellow-600"
                        }>
                        {leave.status}
                        </span>
                    </td>
                    <td className="px-4 py-2">
                        {leave.status === "PENDING" ? (
                        <div className="flex flex-wrap gap-2">
                            <button
                            onClick={() => updateLeaveStatus(leave.leaveId, "APPROVED")}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                            >
                            Approve
                            </button>
                            <button
                            onClick={() => updateLeaveStatus(leave.leaveId, "REJECTED")}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
        </div>

    );
};

export default Leave;
