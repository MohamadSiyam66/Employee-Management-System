import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin/styles/Employee.css";


const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupMode, setPopupMode] = useState(""); // "add", "edit", "view"
    const [formData, setFormData] = useState({
        empId: "",
        username: "",
        password: "",
        role: "EMPLOYEE",
        fname: "",
        lname: "",
        email: "",
        phone: "",
        dob: "",
        designation: ""
    });
    const [message, setMessage] = useState("");

const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
        setMessage("");
    }, 3000);
};

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = () => {
        axios.get("http://localhost:8080/api/employee/employees")
            .then((response) => {
                setEmployees(response.data);
                setFilteredEmployees(response.data);
            })
            .catch((error) => {
                console.error("Error fetching employee data:", error);
            });
    };

    const handleSearch = () => {
        const filtered = employees.filter(emp =>
            `${emp.fname} ${emp.lname}`.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEmployees(filtered);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openPopup = (mode, data = null) => {
        setPopupMode(mode);
        if (data) {
            setFormData(data);
            localStorage.setItem("empId", data.empId);
        } else {
            setFormData({
                empId: "",
                username: "",
                password: "",
                role: "EMPLOYEE",
                fname: "",
                lname: "",
                email: "",
                phone: "",
                dob: "",
                designation: ""
            });
        }
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const addEmployee = () => {
        axios.post("http://localhost:8080/api/employee/add", formData)
            .then(() => {
                fetchEmployees();
                closePopup();
                showMessage("Employee added successfully.");
            })
            .catch(error => console.error("Error adding employee:", error));
    };

    const updateEmployee = () => {
        const id = localStorage.getItem("empId");
        axios.put(`http://localhost:8080/api/employee/update/${id}`, formData)
            .then(() => {
                fetchEmployees();
                closePopup();
                showMessage("Employee updated successfully.");
            })
            .catch(error => console.error("Error updating employee:", error));
    };

    const deleteEmployee = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (confirmed) {
        axios.delete(`http://localhost:8080/api/employee/delete/${id}`)
            .then(() => {
                fetchEmployees();
                showMessage("Employee deleted successfully.");
            })
            .catch(error => console.error("Error deleting employee:", error));
    } else {
        showMessage("Employee deletion cancelled.");
    }
};


    return (
        <div className="employee-container">
            <h3>Employees</h3>
            {message && <center className="employee-message">{message}</center>}
            <div className="employee-actions">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div className="add-employee">
                    <button onClick={() => openPopup("add")}>Add Employee</button>
                </div>
            </div>

            <div className="employee-content">
                <div className="employee-table-container">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Position</th>
                                <th colSpan={3}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.empId}>
                                    <td>{emp.empId}</td>
                                    <td>{emp.fname + " " + emp.lname}</td>
                                    <td>{emp.designation}</td>
                                    <td><button onClick={() => openPopup("view", emp)}>View</button></td>
                                    <td><button onClick={() => openPopup("edit", emp)}>Edit</button></td>
                                    <td><button onClick={() => deleteEmployee(emp.empId)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showPopup && (
                    <div className="employee-form-container">
                        <form>
                            <input name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} disabled={popupMode === "view"} />
                            {popupMode === "add" && <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />}
                            <select name="role" value={formData.role} onChange={handleInputChange} disabled={popupMode === "view"}>
                                <option value="EMPLOYEE">EMPLOYEE</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            <input name="fname" placeholder="First Name" value={formData.fname} onChange={handleInputChange} disabled={popupMode === "view"} />
                            <input name="lname" placeholder="Last Name" value={formData.lname} onChange={handleInputChange} disabled={popupMode === "view"} />
                            <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} disabled={popupMode === "view"} />
                            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} disabled={popupMode === "view"} />
                            <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} disabled={popupMode === "view"} />
                            <input name="designation" placeholder="Designation" value={formData.designation} onChange={handleInputChange} disabled={popupMode === "view"} />
                            <div className="form-buttons">
                                <button type="button" onClick={closePopup}>Close</button>
                                {popupMode === "add" && <button type="button" onClick={addEmployee}>Add</button>}
                                {popupMode === "edit" && <button type="button" onClick={updateEmployee}>Update</button>}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Employee;
