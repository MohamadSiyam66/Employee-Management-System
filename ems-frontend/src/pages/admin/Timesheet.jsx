import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../api";

const Timesheet = () => {
    const [timesheets, setTimesheets] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        fetchTimesheets();
    }, []);

    const fetchTimesheets = () => {
        axios.get(`${BASE_URL}/api/timesheet/timesheets`)
            .then((response) => {
                setTimesheets(response.data);
            })
            .catch((error) => {
                console.error("Error fetching timesheet data:", error);
            });
    };

// ---------- Filter timesheets based on selected date --------------
    const filteredTimesheets = selectedDate ? timesheets.filter(ts => ts.date === selectedDate) : timesheets;

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
            <h3 className="text-2xl font-bold text-cyan-700 mb-4 text-center">Timesheet</h3>
            {/* Date Picker */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <label className="text-gray-700 font-medium">Select Date:</label>
                <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            </div>

            {/* Timesheet Table */}
            <div className="overflow-x-auto overflow-y-auto max-h-[500px] max-md:max-w-[300px]">
                <table className="min-w-full text-sm border border-gray-300 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-cyan-600 text-white">
                        <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">OutTime</th>
                        <th className="px-4 py-2 text-left">InTime</th>
                        <th className="px-4 py-2 text-left">LunchOut</th>
                        <th className="px-4 py-2 text-left">LunchIn</th>
                        <th className="px-4 py-2 text-left">EndTime</th>
                        <th className="px-4 py-2 text-left">Work Hours</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-gray-700">
                        {filteredTimesheets.length > 0 ? (
                        filteredTimesheets.map((ts) => (
                            <tr key={ts.timesheetId} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{ts.timesheetId}</td>
                            <td className="px-4 py-2">{ts.fname + " " + ts.lname}</td>
                            <td className="px-4 py-2">{ts.date}</td>
                            <td className="px-4 py-2">{ts.outTime}</td>
                            <td className="px-4 py-2">{ts.inTime}</td>
                            <td className="px-4 py-2">{ts.lunchOutTime}</td>
                            <td className="px-4 py-2">{ts.lunchInTime}</td>
                            <td className="px-4 py-2">{ts.endTime}</td>
                            <td className="px-4 py-2">{ts.workHours}</td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="9" className="text-center px-4 py-4 text-gray-500 italic">
                            No timesheet entries for selected date.
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default Timesheet;
