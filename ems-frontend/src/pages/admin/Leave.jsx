import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin/styles/Leave.css";

const Leave = () => {
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = () => {
        axios.get("http://localhost:8080/api/leave/leaves")
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
        axios.put(`http://localhost:8080/api/leave/update/${leaveId}`, {
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
        <div className="leave-container">
            <h3>Leave Management</h3>
            {error && <p className="error-message">{error}</p>}
            <div className="leave-filter">
                <label>Status: </label>
                <select value={statusFilter} onChange={handleStatusChange}>
                    <option value="">All</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            <table className="leave-table">
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Days</th>
                        <th>Leave Type</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLeaves.map((leave) => (
                        <tr key={leave.leaveId}>
                            <td>{leave.employee.fname} {leave.employee.lname}</td>
                            <td>{leave.startDate}</td>
                            <td>{leave.endDate}</td>
                            <td>{leave.days}</td>
                            <td>{leave.leaveType}</td>
                            <td>{leave.status}</td>
                            <td>
                                {leave.status === "PENDING" ? (
                                    <>
                                        <button onClick={() => updateLeaveStatus(leave.leaveId, "APPROVED")}>Approve</button>
                                        <button onClick={() => updateLeaveStatus(leave.leaveId, "REJECTED")}>Reject</button>
                                    </>
                                ) : (
                                    "-"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leave;
