import React, { useState, useEffect } from 'react';
import '../employee/styles/EmpAttendance.css';
import axios from 'axios';

const EmpAttendance = () => {
    const emp = localStorage.getItem("userId");
    const [attendance, setAttendance] = useState({
        date: "",
        status: "PRESENT",
        loggedInTime: "",
    });
    const [logoutData, setLogoutData] = useState({
        attendanceId: "",
        loggedOutTime: "",
    });
    const [records, setRecords] = useState([]);
    const [message, setMessage] = useState("");

    const handleAddChange = (e) => {
        setAttendance({ ...attendance, [e.target.name]: e.target.value });
    };

    const handleLogoutChange = (e) => {
        setLogoutData({ ...logoutData, [e.target.name]: e.target.value });
    };

    const fetchAttendance = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/attendance/attendances");
            const emp = localStorage.getItem("userId");
            const filtered = res.data.filter((att) => String(att.empId) === String(emp));
            console.log(filtered);
            setRecords(filtered);
        } catch (err) {
            console.error("Failed to fetch attendance", err);
        }
    };

    const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
        const loginDate = attendance.loggedInTime.split("T")[0]; // Extract date from datetime-local input

        const payload = {
        employee: { empId: emp },
        ...attendance,
        date: loginDate, 
        };

        await axios.post("http://localhost:8080/api/attendance/add", payload);
        setMessage("Attendance added.");
        setAttendance({ empId:"",date: "", status: "PRESENT", loggedInTime: "" });
        fetchAttendance();
    } catch (err) {
        setMessage("Error adding attendance.");
        console.error(err);
    }
    };


    const handleLogoutSubmit = async (e) => {
        e.preventDefault();
        try {
        await axios.put(`http://localhost:8080/api/attendance/update/${logoutData.attendanceId}`, {
            loggedOutTime: logoutData.loggedOutTime,
        });
        setMessage("Logout time updated.");
        setLogoutData({ attendanceId: "", loggedOutTime: "" });
        fetchAttendance();
        } catch (err) {
        setMessage(err + "Error updating logout time.");
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    return (
  <div className="emp-attendance-container">
    <div className="emp-attendance-forms-row">
      <div className="emp-attendance-form-box">
        <h3>Mark Attendance</h3>
        <form className="emp-attendance-form" onSubmit={handleAddSubmit}>
          <label>Status:</label>
          <select name="status" value={attendance.status} onChange={handleAddChange}>
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
          </select>

          <label>Login Time:</label>
          <input type="datetime-local" name="loggedInTime" value={attendance.loggedInTime} onChange={handleAddChange} required />

          <button type="submit">Add</button>
        </form>
      </div>

      <div className="emp-attendance-form-box">
        <h4>Update Logout</h4>
        <form className="emp-attendance-form" onSubmit={handleLogoutSubmit}>
          <label>Attendance ID:</label>
          <input type="text" name="attendanceId" value={logoutData.attendanceId} onChange={handleLogoutChange} required />

          <label>Logout Time:</label>
          <input type="datetime-local" name="loggedOutTime" value={logoutData.loggedOutTime} onChange={handleLogoutChange} required />

          <button type="submit">Update Logout</button>
        </form>
      </div>
    </div>

    {message && <p className="emp-attendance-message">{message}</p>}

    <div className="emp-attendance-table-wrapper">
      <h3>Attendance Records</h3>
      <table className="emp-attendance-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Login</th>
            <th>Logout</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, idx) => (
            <tr key={idx}>
              <td>{rec.attId}</td>
              <td>{rec.status}</td>
              <td>{rec.loggedInTime}</td>
              <td>{rec.loggedOutTime || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
    };

    export default EmpAttendance;