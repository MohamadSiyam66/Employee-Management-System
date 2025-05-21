import React, { useEffect, useState } from "react";
import axios from "axios";
import "../employee/styles/EmpTimesheet.css";

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

    useEffect(() => {
        fetchTimesheets();
    }, []);

    const fetchTimesheets = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/timesheet/timesheets");
            // console.log(res.data); // working
            const filtered = res.data.filter(ts => String(ts.employeeId) == String(empId));
            console.log(filtered); // not working
            setTimesheets(filtered);
        } catch (err) {
            console.error("Failed to fetch timesheets", err);
        }
    };

    const handleAddTimesheet = async () => {
        try {
            await axios.post("http://localhost:8080/api/timesheet/add", {
                employee: { empId: empId },
                date: date,
                startTime: startTime
            });
            alert("Timesheet added!");
            setDate("");
            setStartTime("");
            fetchTimesheets();
        } catch (err) {
            console.error("Error adding timesheet", err);
        }
    };

    const handleUpdateTimesheet = async () => {
        try {
            await axios.put(`http://localhost:8080/api/timesheet/update/${updateData.timesheetId}`, updateData);
            alert("Timesheet updated!");
            setUpdateData({
                timesheetId: "",
                inTime: "",
                outTime: "",
                lunchOutTime: "",
                lunchInTime: "",
                endTime: ""
            });
            fetchTimesheets();
        } catch (err) {
            console.error("Error updating timesheet", err);
        }
    };

    const handleUpdateChange = (e) => {
        setUpdateData({ ...updateData, [e.target.name]: e.target.value });
    };

    return (
    <div className="emp-timesheet-container">
        <h3 className="emp-timesheet-title">Employee Timesheet</h3>

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
                            <th>Work Hours</th>
                            <th>Designation</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timesheets.length > 0 ? (
                            timesheets.map(ts => (
                                <tr key={ts.timesheetId}>
                                    <td>{ts.timesheetId}</td>
                                    <td>{ts.date}</td>
                                    <td>{ts.workHours}</td>
                                    <td>{ts.designation}</td>
                                    <td>{ts.fname} {ts.lname}</td>
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
