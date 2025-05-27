import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin/styles/Attendance.css";
import BASE_URL from "./../../api.js";

const Attendance = () => {
    const [attendances, setAttendances] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        fetchAttendances();
    }, []);

    const fetchAttendances = () => {
        axios.get(`${BASE_URL}/api/attendance/attendances`)
            .then((response) => {
                setAttendances(response.data);
                setFiltered(response.data);
            })
            .catch((error) => {
                console.error("Error fetching attendance data:", error);
            });
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);

        if (date === "") {
            setFiltered(attendances);
        } else {
            const filteredData = attendances.filter(
                (item) => item.date === date
            );
            setFiltered(filteredData);
        }
    };

    return (
        <div className="attendance-container">
            <h3>Employee Attendance</h3>
            <div className="date-filter">
                <label htmlFor="date">Filter by Date:</label>
                <input type="date" id="date" value={selectedDate} onChange={handleDateChange} />
                {selectedDate && (
                    <button onClick={() => {
                        setSelectedDate("");
                        setFiltered(attendances);
                    }}>Clear</button>
                )}
            </div>

            <div className="attendance-table-container">
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th><th>Employee Name</th><th>Date</th><th>Status</th><th>In Time</th><th>Out Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((emp, index) => (
                                <tr key={index}>
                                    <td>{emp.empId}</td>
                                    <td>{emp.fname + " " + emp.lname}</td>
                                    <td>{emp.date}</td>
                                    <td>{emp.status}</td>
                                    <td>{emp.loggedInTime}</td>
                                    <td>{emp.loggedOutTime}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>
                                    No attendance records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attendance;
