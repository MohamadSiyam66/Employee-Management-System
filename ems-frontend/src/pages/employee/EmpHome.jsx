import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../api';

const EmpHome = () => {
    const emp = localStorage.getItem('userId');
    const [employee, setEmployee] = useState({});
    const [leaves, setLeaves] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        fetchEmployee();
        fetchLeaves();
        fetchAttendance();
    }, []);

    const fetchEmployee = () => {
        axios.get(`${BASE_URL}/api/employee/employee/${emp}`)
            .then(res => {
                setEmployee(res.data);
                setFormData({
                    username: res.data.username || '',
                    password: res.data.password || '',
                    email: res.data.email || '',
                    phone: res.data.phone || ''
                });
            });
    };

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/leave/leaves`);
            const empLeaves = response.data.filter((leave) => leave.employee.empId === emp);
            setLeaves(empLeaves);
        } catch (error) {
            console.error("Error fetching leaves:", error);
        }
};


    const fetchAttendance = () => {
        const emp = localStorage.getItem('userId');
        axios.get(`${BASE_URL}/api/attendance/attendances`)
            .then(res => {
                const filtered = res.data
                    .filter((att) => String(att.empId) === String(emp))
                    .slice(-5);
                    // console.log(res.data);
                setAttendances(filtered);
            });
    };

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const updateEmployee = () => {
        axios.put(`${BASE_URL}/api/employee/update/${emp}`, {
            ...employee,
            ...formData
        }).then(() => {
            alert("Profile updated!");
            fetchEmployee();
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-2">
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
                <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
                    <h4 className="text-xl font-semibold text-blue-600 mb-4">Basic Info</h4>
                    <p className="text-gray-700"><strong>Name:</strong> {employee.fname + " " + employee.lname}</p>
                    <p className="text-gray-700"><strong>Designation:</strong> {employee.designation}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
                    <h4 className="text-xl font-semibold text-green-600 mb-4">Leave Details</h4>
                    {leaves.length > 0 ? (
                    leaves.map((leave) => (
                        <div key={leave.leaveId} className="mb-4 border-b pb-2">
                        <p className="text-gray-700"><strong>Type:</strong> {leave.leaveType}</p>
                        <p className="text-gray-700"><strong>Status:</strong> {leave.status}</p>
                        <p className="text-gray-700">
                            <strong>From:</strong> {leave.startDate} <strong>To:</strong> {leave.endDate}
                        </p>
                        </div>
                    ))
                    ) : (
                    <p className="text-gray-500">No leave records found.</p>
                    )}
                </div>

                {/* Attendance */}
                <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
                    <h4 className="text-xl font-semibold text-purple-600 mb-4">Last 5 Days Attendance</h4>
                    {attendances.length > 0 ? (
                    attendances.map((att, index) => (
                        <p key={index} className="text-gray-700"><strong>{att.date}:</strong> {att.status}</p>
                    ))
                    ) : (
                    <p className="text-gray-500">No attendance records found.</p>
                    )}
                </div>
            </div>
            <div className="flex-1">
                <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
                    <h4 className="text-xl font-semibold text-red-600 mb-4">Update Info</h4>
                    <div className="flex flex-col gap-4">
                    <input
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={updateEmployee}
                        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update
                    </button>
                </div>
            </div>
            </div>
        </div>
        </div>

    );
};

export default EmpHome;
