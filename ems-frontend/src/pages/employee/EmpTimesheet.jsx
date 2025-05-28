import React, { useEffect, useState } from "react";
import axios from "axios";
import "../employee/styles/EmpTimesheet.css";
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
    <div className="emp-timesheet-container">
        <h3 className="emp-timesheet-title">Employee Timesheet</h3>
        {message && <p className="emp-timesheet-message">{message}</p>}
        {error && <p className="emp-timesheet-error">{error}</p>}
        <div className="emp-timesheet-row">
            <div className="emp-timesheet-form-box">
                <h4>Add Timesheet</h4>
                <label>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="emp-timesheet-input" />

                <label>Start Time</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="emp-timesheet-input" />

                <button onClick={handleAddTimesheet} className="emp-timesheet-btn">
                    Submit
                </button>
            </div>

            <div className="emp-timesheet-form-box">
                <h4>Update Timesheet</h4>
                <label>Timesheet ID</label>
                <input name="timesheetId" value={updateData.timesheetId} onChange={handleUpdateChange} className="emp-timesheet-input" />

                <label>In Time</label>
                <input name="inTime" type="time" value={updateData.inTime} onChange={handleUpdateChange} className="emp-timesheet-input" />

                <label>Out Time</label>
                <input name="outTime" type="time" value={updateData.outTime} onChange={handleUpdateChange} className="emp-timesheet-input" />

                <label>Lunch Out</label>
                <input name="lunchOutTime" type="time" value={updateData.lunchOutTime} onChange={handleUpdateChange} className="emp-timesheet-input" />

                <label>Lunch In</label>
                <input name="lunchInTime" type="time" value={updateData.lunchInTime} onChange={handleUpdateChange} className="emp-timesheet-input" />

                <label>End Time</label>
                <input name="endTime" type="time" value={updateData.endTime} onChange={handleUpdateChange} className="emp-timesheet-input" />

                <button onClick={handleUpdateTimesheet} className="emp-timesheet-btn">
                    Update
                </button>
            </div>

            <div className="emp-timesheet-table-box">
                <h4>Timesheet Records</h4>
                <table className="emp-timesheet-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>OutTime</th>
                            <th>InTime</th>
                            <th>LunchOut</th>
                            <th>LunchIn</th>
                            <th>EndTime</th>
                            <th>Work Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timesheets.length > 0 ? (
                            timesheets.map(ts => (
                                <tr key={ts.timesheetId}>
                                    <td>{ts.timesheetId}</td>
                                    <td>{ts.date}</td>
                                    <td>{ts.outTime}</td>
                                    <td>{ts.inTime}</td>
                                    <td>{ts.lunchOutTime}</td>
                                    <td>{ts.lunchInTime}</td>
                                    <td>{ts.endTime}</td>
                                    <td>{ts.workHours}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="emp-timesheet-no-data">
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
