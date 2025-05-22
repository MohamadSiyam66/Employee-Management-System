import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin/styles/Employee.css";

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showPopup, setShowPopup] = useState(false); // default closed
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
    const [error, setError] = useState("");

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 3000);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

// ------------------- get employees -------------
    const fetchEmployees = () => {
        axios.get("http://localhost:8080/api/employee/employees")
            .then((response) => {
                setEmployees(response.data);
                setFilteredEmployees(response.data);
            })
            .catch((error) => {
                setError("Error fetching employee data: " + error.message);
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
        setError("");
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

    const MIN_PASSWORD_LENGTH = 8;
    const MIN_NAME_LENGTH = 3;
    const PHONE_LENGTH = 10;

// ------------------- form validation -------------
    const validateEmployee = (formData, employees, isEdit = false) => {

        const currentId = formData.empId;

        const duplicate = (field) =>
            employees.some(emp => emp[field] === formData[field] && (!isEdit || emp.empId !== currentId)
        );
        
        if (duplicate("email")) {
            return "Email already exists.";
        }
        if (duplicate("username")) {
            return "Username already exists.";
        }
        if (duplicate("phone")) {
            return "Phone number already exists.";
        }
        if (!/^\d+$/.test(formData.phone)) {
            return "Phone number must contain only digits.";
        }
        if (employees.some(emp => emp.email === formData.email && emp.empId !== currentId)) {
            return "Email already exists.";     
        }
        if (!isEdit && formData.password.length < MIN_PASSWORD_LENGTH) {
            return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
        }
        if (formData.fname.length < MIN_NAME_LENGTH || formData.lname.length < MIN_NAME_LENGTH) {
            return "First name and last name must be at least 3 characters long.";
        }
        if (formData.phone.length < PHONE_LENGTH) {
            return "Phone number must be at least 10 digits long.";
        }
        return null;
    };

// ------------------- add employee -------------
    const addEmployee = () => {
        const errorMessage = validateEmployee(formData, employees);
        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        axios.post("http://localhost:8080/api/employee/add", formData)
            .then(() => {
                fetchEmployees();
                closePopup();
                showMessage("Employee added successfully.");
            })
            .catch(error => console.error("Error adding employee:", error));
    };

// ------------------- update employee -------------
    const updateEmployee = () => {
        const errorMessage = validateEmployee(formData, employees, true);
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
        const id = localStorage.getItem("empId");
        axios.put(`http://localhost:8080/api/employee/update/${id}`, formData)
            .then(() => {
                fetchEmployees();
                closePopup();
                showMessage("Employee updated successfully.");
            })
            .catch(error => console.error("Error updating employee:", error));
    };
// ------------------- delete employee -------------
    const deleteEmployee = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (confirmed) {
        axios.delete(`http://localhost:8080/api/employee/delete/${id}`)
            .then(() => {
                fetchEmployees();
                showMessage("Employee deleted successfully.");
            })
            .catch(error => {
                console.error("Error deleting employee:", error);
                setError("Error deleting employee: " + error.message);
            });
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
                    {searchQuery && (
                    <button onClick={() => {
                        setSearchQuery("");
                        setFilteredEmployees(employees);
                    }}>Clear</button>
                )}
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
{/*--------------- Popup for Add/Edit/View Employee */}
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
                            {/* Display error message */}
                            {error && <p className="error-message">{error}</p>}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Employee;
