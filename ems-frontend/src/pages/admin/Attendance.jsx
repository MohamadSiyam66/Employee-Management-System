import React, { useEffect, useState } from "react";
import axios from "axios";
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
        <div className="md:p-6 bg-white shadow-xl rounded-lg mx-auto">
            <h3 className="text-2xl font-bold text-cyan-700 mb-4 text-center">Employee Attendance</h3>
            {/* Date Filter */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4 mb-6">
                <label htmlFor="date" className="text-gray-700 font-medium">Filter by Date:</label>
                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                {selectedDate && (
                    <button
                        onClick={() => {
                            setSelectedDate("");
                            setFiltered(attendances);
                    }}
                        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                    >
                        Clear
                    </button>
                )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto overflow-y-auto max-h-[500px] max-md:max-w-[300px]">
                <table className="min-w-full text-sm border border-gray-300 shadow-md rounded overflow-hidden">
                <thead className="bg-cyan-600 text-white sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-2 text-left">Employee ID</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">In Time</th>
                        <th className="px-4 py-2 text-left">Out Time</th>
                    </tr>
                </thead>
                <tbody className="bg-white text-gray-700">
                    {filtered.length > 0 ? (
                    filtered.map((emp, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{emp.empId}</td>
                            <td className="px-4 py-2">{emp.fname + " " + emp.lname}</td>
                            <td className="px-4 py-2">{emp.date}</td>
                            <td className="px-4 py-2">{emp.status}</td>
                            <td className="px-4 py-2">{emp.loggedInTime}</td>
                            <td className="px-4 py-2">{emp.loggedOutTime}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="6" className="text-center px-4 py-4 text-gray-500 italic">
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
