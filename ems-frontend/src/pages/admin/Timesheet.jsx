import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin/styles/Timesheet.css";
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
        <div className="timesheet-container">
            <h3>Timesheet</h3>

            <div className="date-picker-container">
                <label>Select Date:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <div className="table-container">
                <table className="timesheet-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee Name</th>
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
                        {filteredTimesheets.map((ts) => (
                            <tr key={ts.timesheetId}>
                                <td>{ts.timesheetId}</td>
                                <td>{ts.fname + " " + ts.lname}</td>
                                <td>{ts.date}</td>
                                <td>{ts.outTime}</td>
                                <td>{ts.inTime}</td>
                                <td>{ts.lunchOutTime}</td>
                                <td>{ts.lunchInTime}</td>
                                <td>{ts.endTime}</td>
                                <td>{ts.workHours}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTimesheets.length === 0 && (
                    <p className="no-data">No timesheet entries for selected date.</p>
                )}
            </div>
        </div>
    );
};

export default Timesheet;
