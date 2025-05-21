import React, { useState, useEffect } from "react";
import axios from "axios";
import "../employee/styles/EmpLeave.css";

const EmpLeave = () => {
  const empId = localStorage.getItem("userId");
  const [leaveData, setLeaveData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "CASUAL",
    description: "",
  });
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      employee: { empId },
      ...leaveData,
    };

    try {
      await axios.post("http://localhost:8080/api/leave/add", payload);
      setMessage("Leave applied successfully!");
      setLeaveData({
        startDate: "",
        endDate: "",
        leaveType: "CASUAL",
        description: "",
      });
      fetchLeaves();
    } catch (error) {
      setMessage("Failed to apply for leave.");
      console.error(error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/leave/leaves");
      const empLeaves = response.data.filter((leave) => leave.employee.empId === Number(empId));
      setLeaves(empLeaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="emp-leave-container">
      <div className="emp-leave-form-section">
        <h3>Apply Leave</h3>
        <form className="emp-leave-form" onSubmit={handleSubmit}>
          <label>Start Date:</label>
          <input type="date" name="startDate" value={leaveData.startDate} onChange={handleChange} required />

          <label>End Date:</label>
          <input type="date" name="endDate" value={leaveData.endDate} onChange={handleChange} required />

          <label>Leave Type:</label>
          <select name="leaveType" value={leaveData.leaveType} onChange={handleChange}>
            <option value="CASUAL">CASUAL</option>
            <option value="MEDICAL">MEDICAL</option>
          </select>

          <label>Description:</label>
          <textarea name="description" value={leaveData.description} onChange={handleChange} required />

          <button type="submit">Apply</button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>

      <div className="emp-leave-table-section">
        <h3>Your Leaves</h3>
        <table className="emp-leave-table">
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Type</th>
              <th>Status</th>
              <th>Days</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, index) => (
              <tr key={index}>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.status}</td>
                <td>{leave.days}</td>
                <td>{leave.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpLeave;
