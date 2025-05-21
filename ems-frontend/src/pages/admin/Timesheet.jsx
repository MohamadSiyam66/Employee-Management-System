import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin/styles/Timesheet.css";

const Timesheet = () => {
    const [timesheets, setTimesheets] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        fetchTimesheets();
    }, []);

    const fetchTimesheets = () => {
        axios.get("http://localhost:8080/api/timesheet/timesheets")
            .then((response) => {
                setTimesheets(response.data);
            })
            .catch((error) => {
                console.error("Error fetching timesheet data:", error);
            });
    };

    const filteredTimesheets = selectedDate
        ? timesheets.filter(ts => ts.date === selectedDate)
        : timesheets;

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
                            <th>Date</th>
                            <th>Work Hours</th>
                            <th>Name</th>
                            <th>Designation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTimesheets.map((ts) => (
                            <tr key={ts.timesheetId}>
                                <td>{ts.timesheetId}</td>
                                <td>{ts.date}</td>
                                <td>{ts.workHours}</td>
                                <td>{ts.fname+" "+ts.lname}</td>
                                <td>{ts.designation}</td>
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
