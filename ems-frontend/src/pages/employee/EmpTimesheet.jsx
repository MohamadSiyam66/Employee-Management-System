import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../api";

const EmpTimesheet = () => {
    const empId = localStorage.getItem("userId");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [updateData, setUpdateData] = useState({
        timesheetId: "",
        inTime: "",
        outTime: "",
        lunchOutTime: "",
        lunchInTime: "",
        endTime: ""
    });
    const [timesheets, setTimesheets] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTimesheets();
        console.log(updateData.endTime);
        if (error || message) {
            const timer = setTimeout(() => {
                setError("");
                setMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, message]);

    const fetchTimesheets = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/timesheet/timesheets`);
            // console.log(res.data); // working
            const filtered = res.data.filter(ts => String(ts.employeeId) == String(empId));
            console.log(filtered); // not working
            setTimesheets(filtered);
        } catch (err) {
            console.error("Failed to fetch timesheets", err);
        }
    };

    const handleAddTimesheet = async () => {

        const alreadyAdded = timesheets.some(ts => ts.date === date);
        if (alreadyAdded) {
            setMessage("You have already added a timesheet for today.");
            return;
        }

        try {
            await axios.post(`${BASE_URL}/api/timesheet/add`, {
                employee: { empId: empId },
                date: date,
                startTime: startTime
            });
            setMessage("Timesheet added!");
            setDate("");
            setStartTime("");
            fetchTimesheets();
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError("Timesheet for today already exists!");
            } else {
                console.error("Error adding timesheet", err);
            }
        }
    };

    const handleUpdateTimesheet = async () => {
        const lunchout = timesheets.some(ts => ts.date === date && ts.lunchOutTime !== null);
        const lunch = timesheets.some(ts => ts.date === date && ts.lunchInTime !== null);
        const outTime = timesheets.some(ts => ts.date === date && ts.outTime !== null);
        const inTime = timesheets.some(ts => ts.date === date && ts.inTime !== null);   
        if (lunch) {
            setMessage("You have already added a lunchInTime for today.");
            return;
        }
        if (lunchout) {
            setMessage("You have already added a lunchOutTime for today.");
            return;
        }
        if (outTime) {
            setMessage("You have already added an outTime for today.");
            return;
        }
        if (inTime) {
            setMessage("You have already added an inTime for today.");
            return;
        }

        try {
            await axios.put(`${BASE_URL}/api/timesheet/update/${updateData.timesheetId}`, updateData);
            console.log("Timesheet updated!");
            setUpdateData({
                timesheetId: "",
                inTime: "",
                outTime: "",
                lunchOutTime: "",
                lunchInTime: "",
                endTime: ""
            });
            fetchTimesheets();
            setMessage("Timesheet updated!");
        } catch (err) {
            setError("Error updating timesheet", err);
        }
    };

    const handleUpdateChange = (e) => {
        setUpdateData({ ...updateData, [e.target.name]: e.target.value });
    };

    return (
    <div className="max-w-7xl mx-auto p-2">
        <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">Employee Timesheet</h3>
        {message && <p className="text-green-600 font-medium mb-2 text-center">{message}</p>}
        {error && <p className="text-red-600 font-medium mb-4 text-center">{error}</p>}
        <div className="flex flex-col md:flex-row gap-6">
            {/* Add Timesheet */}
            <div className="flex-1 bg-green-50 shadow-md p-2 rounded-lg">
                <h4 className="text-lg font-semibold text-green-700 mb-4">Add Timesheet</h4>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-green-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-green-400 focus:outline-none"
                        />
                    </div>

                    <button
                    onClick={handleAddTimesheet}
                    className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                    Submit
                    </button>
                </div>
            </div>

            {/* Update Timesheet */}
            <div className="flex-1 bg-blue-50 shadow-md p-2 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-700 mb-4">Update Timesheet</h4>
                <div className="flex flex-col gap-4">
                    {[
                        { label: "Timesheet ID", name: "timesheetId" },
                        { label: "In Time", name: "inTime" },
                        { label: "Out Time", name: "outTime" },
                        { label: "Lunch Out", name: "lunchOutTime" },
                        { label: "Lunch In", name: "lunchInTime" },
                        { label: "End Time", name: "endTime" },
                    ].map(({ label, name }) => (
                    <div key={name}>
                        <label className="block text-sm font-medium text-gray-700">{label}</label>
                        <input
                            type={name === "timesheetId" ? "text" : "time"}
                            name={name}
                            value={updateData[name]}
                            onChange={handleUpdateChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    ))}

                <button
                    onClick={handleUpdateTimesheet}
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Update
                </button>
            </div>
            </div>
        </div>

        {/* Timesheet Table */}
        <div className="mt-10 bg-white shadow-md rounded-lg p-2 overflow-x-auto">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Timesheet Records</h4>
            <div className="overflow-x-auto bg-white shadow rounded-lg max-h-[400px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-cyan-600 text-white sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold">ID</th>
                            <th className="p-3 text-left text-sm font-semibold">Date</th>
                            <th className="p-3 text-left text-sm font-semibold">OutTime</th>
                            <th className="p-3 text-left text-sm font-semibold">InTime</th>
                            <th className="p-3 text-left text-sm font-semibold">LunchOut</th>
                            <th className="p-3 text-left text-sm font-semibold">LunchIn</th>
                            <th className="p-3 text-left text-sm font-semibold">EndTime</th>
                            <th className="p-3 text-left text-sm font-semibold">Work Hours</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                    {timesheets.length > 0 ? (
                        timesheets.map((ts) => (
                        <tr
                            key={ts.timesheetId}
                            className="hover:bg-gray-100 transition border-b border-gray-200"
                        >
                            <td className="p-3">{ts.timesheetId}</td>
                            <td className="p-3">{ts.date}</td>
                            <td className="p-3">{ts.outTime}</td>
                            <td className="p-3">{ts.inTime}</td>
                            <td className="p-3">{ts.lunchOutTime}</td>
                            <td className="p-3">{ts.lunchInTime}</td>
                            <td className="p-3">{ts.endTime}</td>
                            <td className="p-3">{ts.workHours}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center p-4 text-gray-500">
                                No timesheet data available.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

);

};

export default EmpTimesheet;
