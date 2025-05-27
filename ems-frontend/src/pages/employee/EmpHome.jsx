import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../employee/styles/EmpHome.css';
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
        axios.get('http://localhost:8080/api/attendance/attendances')
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
        axios.put(`http://localhost:8080/api/employee/update/${emp}`, {
            ...employee,
            ...formData
        }).then(() => {
            alert("Profile updated!");
            fetchEmployee();
        });
    };

    return (
        <div className="profile-container">
            <h3>Employee Profile</h3>
            <div className="main-content">
                {/* Left Column */}
                <div className="left-column">
                    <div className="card">
                        <h4>Basic Info</h4>
                        <p><strong>Name:</strong> {employee.fname + " "+ employee.lname}</p>
                        <p><strong>Designation:</strong> {employee.designation}</p>
                    </div>

                    <div className="card">
                        <h4>Leave Details</h4>
                        {leaves.length > 0 ? (
                            leaves.map(leave => (
                                <div key={leave.leaveId} className="leave-entry">
                                    <p><strong>Type:</strong> {leave.leaveType}</p>
                                    <p><strong>Status:</strong> {leave.status}</p>
                                    <p><strong>From:</strong> {leave.startDate} <strong>To:</strong> {leave.endDate}</p>
                                    <hr />
                                </div>
                            ))
                        ) : <p>No leave records found.</p>}
                    </div>

                    <div className="card">
                        <h4>Last 5 Days Attendance</h4>
                        {attendances.length > 0 ? (
                            attendances.map((att, index) => (
                                <p key={index}><strong>{att.date}:</strong> {att.status}</p>
                            ))
                        ) : <p>No attendance records found.</p>}
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column">
                    <div className="card">
                        <h4>Update Info</h4>
                        <input name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
                        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
                        <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
                        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} /> <br />
                        <button onClick={updateEmployee}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpHome;
