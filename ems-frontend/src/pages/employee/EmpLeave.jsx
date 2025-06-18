import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../api";

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
      await axios.post(`${BASE_URL}/api/leave/add`, payload);
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
      const response = await axios.get(`${BASE_URL}/api/leave/leaves`);
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
    <div className="max-w-6xl mx-auto p-2">
      <div className="bg-blue-50 p-2 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold text-blue-800 mb-4">Apply Leave</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={leaveData.startDate}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">End Date:</label>
            <input
              type="date"
              name="endDate"
              value={leaveData.endDate}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Leave Type:</label>
            <select
              name="leaveType"
              value={leaveData.leaveType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="CASUAL">CASUAL</option>
              <option value="MEDICAL">MEDICAL</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">Description:</label>
            <textarea
              name="description"
              value={leaveData.description}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Apply
            </button>
            {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
          </div>
        </form>
      </div>

      {/* Leave Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Leaves</h3>
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] max-md:max-w-[300px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-cyan-600 text-white sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">Start</th>
                <th className="px-4 py-2 text-left">End</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Days</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.map((leave, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{leave.startDate}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.endDate}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.leaveType}</td>
                  <td className="px-2 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        leave.status === "APPROVED"
                          ? "bg-green-500"
                          : leave.status === "PENDING"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.days}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};

export default EmpLeave;
