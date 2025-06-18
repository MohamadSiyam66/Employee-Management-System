import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "./../../api.js";

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
        axios.get(`${BASE_URL}/api/employee/employees`)
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

        axios.post(`${BASE_URL}/api/employee/add`, formData)
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
        axios.put(`${BASE_URL}/api/employee/update/${id}`, formData)
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
        axios.delete(`${BASE_URL}/api/employee/delete/${id}`)
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
    <div className="md:p-6 bg-white shadow-xl rounded-lg mx-auto">
        <h3 className="text-2xl font-bold text-center text-cyan-700 mb-4">Employees</h3>
        {message && (
            <div className="text-center text-green-600 font-semibold mb-4">{message}</div>
        )}

    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="flex gap-2 md:w-2/3">
        <input
            type="text"
            placeholder="Search by name"
            className="flex-grow p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
            className="bg-cyan-600 text-white px-4 py-2 rounded shadow hover:bg-cyan-700"
            onClick={handleSearch}
        >
            Search
        </button>
        {searchQuery && (
            <button
            className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400"
            onClick={() => {
                setSearchQuery("");
                setFilteredEmployees(employees);
            }}
            >
            Clear
            </button>
        )}
        </div>
        <div className="text-right ">
        <button
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
            onClick={() => openPopup("add")}
        >
            Add Employee
        </button>
        </div>
    </div>

    <div className="overflow-x-auto overflow-y-auto max-h-[500px] max-md:max-w-[300px]">
        <table className="min-w-full max-md:w-[200px] divide-y divide-gray-200">
        <thead className="bg-cyan-600 text-white sticky top-0 z-10">
            <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Full Name</th>
                <th className="px-4 py-2 text-left">Position</th>
                <th colSpan={3} className="px-4 py-2 text-left">Actions</th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((emp) => (
            <tr key={emp.empId} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{emp.empId}</td>
                <td className="px-4 py-2 whitespace-nowrap">{emp.fname + " " + emp.lname}</td>
                <td className="px-4 py-2 whitespace-nowrap">{emp.designation}</td>
                <td className="px-2 py-2"><button className="bg-blue-600 py-1 px-2 text-white hover:font-bold rounded" onClick={() => openPopup("view", emp)}>View</button></td>
                <td className="px-2 py-2"><button className="bg-yellow-600 py-1 px-2 text-white hover:font-bold rounded" onClick={() => openPopup("edit", emp)}>Edit</button></td>
                <td className="px-2 py-2"><button className="bg-red-600 py-1 px-2 text-white hover:font-bold rounded" onClick={() => deleteEmployee(emp.empId)}>Delete</button></td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>

    {showPopup && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
            {message && (
            <div className="text-center text-green-600 font-semibold mb-4">{message}</div>
            )}
            <form className="space-y-4">
            <input name="username" placeholder="Username" className="w-full p-2 border rounded" value={formData.username} onChange={handleInputChange} disabled={popupMode === "view"} />
            {popupMode === "add" && (
                <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" value={formData.password} onChange={handleInputChange} />
            )}
            <select name="role" className="w-full p-2 border rounded" value={formData.role} onChange={handleInputChange} disabled={popupMode === "view"}>
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ADMIN">ADMIN</option>
            </select>
            <input name="fname" placeholder="First Name" className="w-full p-2 border rounded" value={formData.fname} onChange={handleInputChange} disabled={popupMode === "view"} />
            <input name="lname" placeholder="Last Name" className="w-full p-2 border rounded" value={formData.lname} onChange={handleInputChange} disabled={popupMode === "view"} />
            <input name="email" placeholder="Email" className="w-full p-2 border rounded" value={formData.email} onChange={handleInputChange} disabled={popupMode === "view"} />
            <input name="phone" placeholder="Phone" className="w-full p-2 border rounded" value={formData.phone} onChange={handleInputChange} disabled={popupMode === "view"} />
            <input name="dob" type="date" className="w-full p-2 border rounded" value={formData.dob} onChange={handleInputChange} disabled={popupMode === "view"} />
            <input name="designation" placeholder="Designation" className="w-full p-2 border rounded" value={formData.designation} onChange={handleInputChange} disabled={popupMode === "view"} />
            <div className="flex justify-end gap-2">
                <button type="button" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={closePopup}>Close</button>
                {popupMode === "add" && (
                <button type="button" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={addEmployee}>Add</button>
                )}
                {popupMode === "edit" && (
                <button type="button" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700" onClick={updateEmployee}>Update</button>
                )}
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </form>
        </div>
        </div>
    )}
    </div>


    );
};

export default Employee;
