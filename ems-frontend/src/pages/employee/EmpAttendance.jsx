import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../api';

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
            const res = await axios.get(`${BASE_URL}/api/attendance/attendances`);
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
      const loginDate = attendance.loggedInTime.split("T")[0]; // Extract date

      // Check if today's attendance already exists
      const hasTodayAttendance = records.some(
        (rec) => rec.date === loginDate
      );

      if (hasTodayAttendance) {
        setMessage("You have already marked attendance for today.");
        return;
      }

      const payload = {
        employee: { empId: emp },
        ...attendance,
        date: loginDate,
      };

      await axios.post(`${BASE_URL}/api/attendance/add`, payload);
      setMessage("Attendance added.");
      setAttendance({ empId: "", date: "", status: "PRESENT", loggedInTime: "" });
      fetchAttendance();
    } catch (err) {
      setMessage("Error adding attendance.");
      console.error(err);
    }
  };



    const handleLogoutSubmit = async (e) => {
      e.preventDefault();

      try {
        const rec = records.find(
          (r) => String(r.attId) === String(logoutData.attendanceId)
        );

        if (!rec) {
          setMessage("Attendance ID not found.");
          return;
        }

        if (rec.loggedOutTime) {
          setMessage("Logout time already recorded for this attendance.");
          return;
        }

        await axios.put(`${BASE_URL}/api/attendance/update/${logoutData.attendanceId}`, {
          loggedOutTime: logoutData.loggedOutTime,
        });

        setMessage("Logout time updated.");
        setLogoutData({ attendanceId: "", loggedOutTime: "" });
        fetchAttendance();
      } catch (err) {
        setMessage("Error updating logout time.");
        console.error(err);
      }
    };

    useEffect(() => {
        fetchAttendance();
        if (message) {
          const timer = setTimeout(() => setMessage(""), 3000);
          return () => clearTimeout(timer);
        }
    }, [message]);

    return (
      <div className="md:p-6 bg-white shadow-xl rounded-lg mx-auto">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Add Attendance Form */}
        <div className="flex-1 bg-green-50 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Mark Attendance</h3>
          <form className="flex flex-col gap-4" onSubmit={handleAddSubmit}>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Status:</label>
              <select
                name="status"
                value={attendance.status}
                onChange={handleAddChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-400"
              >
                <option value="PRESENT">PRESENT</option>
                <option value="ABSENT">ABSENT</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Login Time:</label>
              <input
                type="datetime-local"
                name="loggedInTime"
                value={attendance.loggedInTime}
                onChange={handleAddChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Add
            </button>
          </form>
        </div>

        {/* Update Logout Form */}
        <div className="flex-1 bg-blue-50 p-4 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold mb-4 text-blue-700">Update Logout</h4>
          <form className="flex flex-col gap-4" onSubmit={handleLogoutSubmit}>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Attendance ID:</label>
              <input
                type="text"
                name="attendanceId"
                value={logoutData.attendanceId}
                onChange={handleLogoutChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Logout Time:</label>
              <input
                type="datetime-local"
                name="loggedOutTime"
                value={logoutData.loggedOutTime}
                onChange={handleLogoutChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Update Logout
            </button>
          </form>
        </div>
      </div>

      {/* Message */}
      {message && (
        <p className="text-center text-sm text-gray-600 font-medium mb-4">{message}</p>
      )}

      {/* Attendance Records Table */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Attendance Records</h3>
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] max-md:max-w-[300px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-cyan-600 text-white sticky top-0">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Login</th>
                <th className="p-3 border">Logout</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {records.map((rec, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{rec.attId}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{rec.status}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{rec.loggedInTime}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{rec.loggedOutTime || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

);
    };

    export default EmpAttendance;