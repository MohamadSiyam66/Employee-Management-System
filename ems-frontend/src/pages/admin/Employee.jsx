import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "./../../api.js";
import { 
    Plus, Search, X, Eye, Edit, Trash2, 
    User, Mail, Phone, Calendar,Briefcase,Users,
    Filter, Download, RefreshCw, AlertCircle
} from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomTooltip from '../../components/CustomTooltip';
import Swal from 'sweetalert2';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupMode, setPopupMode] = useState("");
    const [loading, setLoading] = useState(false);
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

    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    
    // Validation states
    const [validationErrors, setValidationErrors] = useState({
        username: "",
        password: "",
        fname: "",
        lname: "",
        email: "",
        phone: "",
        dob: "",
        designation: ""
    });
    
    const [showTooltips, setShowTooltips] = useState({
        username: false,
        password: false,
        fname: false,
        lname: false,
        email: false,
        phone: false,
        dob: false,
        designation: false
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Fetch employees with loading state
    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/employee/employees`);
            setEmployees(response.data);
            setFilteredEmployees(response.data);
        } catch (error) {
            toast.error("Error fetching employee data: " + error.message);
            //console.error("Error fetching employee data:", error);
        } finally {
            setLoading(false);
        }
    };

    // employee search filtering
    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = employees.filter(emp =>
            `${emp.fname} ${emp.lname}`.toLowerCase().includes(query.toLowerCase()) ||
            emp.email.toLowerCase().includes(query.toLowerCase()) ||
            emp.designation.toLowerCase().includes(query.toLowerCase()) ||
            emp.empId.toString().includes(query)
        );
        setFilteredEmployees(filtered);
    };

    // Filter by role
    const filterByRole = (role) => {
        setActiveTab(role);
        if (role === "all") {
            setFilteredEmployees(employees);
        } else {
            const filtered = employees.filter(emp => emp.role === role);
            setFilteredEmployees(filtered);
        }
    };

    // Validation functions
    const validateUsername = (username) => {
        if (!username) return "";
        if (!/^[a-zA-Z]+$/.test(username)) {
            return "Username should only contain letters";
        }
        if (employees.some(emp => emp.username === username && emp.empId !== formData.empId)) {
            return "Username already exists";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "";
        if (password.length < 8 || password.length > 12) {
            return "Password must be 8-12 characters long";
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return "Password must include a capital letter";
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return "Password must include a lowercase letter";
        }
        if (!/(?=.*\d)/.test(password)) {
            return "Password must include a number";
        }
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
            return "Password must include a symbol";
        }
        if (/(.)\1{3,}/.test(password)) {
            return "Password cannot have sequential numbers like 1111";
        }
        const fullName = `${formData.fname} ${formData.lname}`.toLowerCase();
        if (fullName && password.toLowerCase().includes(fullName.replace(/\s+/g, ''))) {
            return "Password cannot contain your name";
        }
        return "";
    };

    const validateName = (name, fieldName) => {
        if (!name) return "";
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return `${fieldName} should only contain letters`;
        }
        if (name.trim().length < 3) {
            return `${fieldName} should contain at least 3 letters`;
        }
        return "";
    };

    const validateEmail = (email) => {
        if (!email) return "";
        if (!email.endsWith('@rubaai.net')) {
            return "Email must end with @rubaai.net";
        }
        if (employees.some(emp => emp.email === email && emp.empId !== formData.empId)) {
            return "Email already exists";
        }
        return "";
    };

    const validatePhone = (phone) => {
        if (!phone) return "";
        if (!/^\d+$/.test(phone)) {
            return "Phone number should only contain numbers";
        }
        if (phone.length > 10) {
            return "Phone number should not exceed 10 digits";
        }
        if (employees.some(emp => emp.phone === phone && emp.empId !== formData.empId)) {
            return "Phone number already exists";
        }
        return "";
    };

    const validateDOB = (dob) => {
        if (!dob) return "";
        const selectedDate = new Date(dob);
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 18);
        
        if (selectedDate > today) {
            return "Date of birth cannot be in the future";
        }
        if (selectedDate > minDate) {
            return "Employee must be at least 18 years old";
        }
        return "";
    };

    const validateDesignation = (designation) => {
        if (!designation) return "";
        if (!/^[a-zA-Z\s]+$/.test(designation)) {
            return "Designation should only contain letters";
        }
        return "";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Validate the field
        let error = "";
        switch (name) {
            case 'username':
                error = validateUsername(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
            case 'fname':
                error = validateName(value, 'First name');
                break;
            case 'lname':
                error = validateName(value, 'Last name');
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'phone':
                error = validatePhone(value);
                break;
            case 'dob':
                error = validateDOB(value);
                break;
            case 'designation':
                error = validateDesignation(value);
                break;
            default:
                break;
        }
        
        setValidationErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleFieldFocus = (fieldName) => {
        setShowTooltips(prev => ({ ...prev, [fieldName]: true }));
    };

    const handleFieldBlur = (fieldName) => {
        setShowTooltips(prev => ({ ...prev, [fieldName]: false }));
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

    // Enhanced validation
    const validateEmployee = (formData, employees, isEdit = false) => {
        const currentId = formData.empId;

        const duplicate = (field) =>
            employees.some(emp => emp[field] === formData[field] && (!isEdit || emp.empId !== currentId));

        if (!formData.fname.trim() || !formData.lname.trim()) {
            return "First name and last name are required.";
        }
        
        if (formData.fname.length < MIN_NAME_LENGTH || formData.lname.length < MIN_NAME_LENGTH) {
            return "First name and last name must be at least 3 characters long.";
        }

        if (!formData.email.trim()) {
            return "Email is required.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return "Please enter a valid email address.";
        }

        if (duplicate("email")) {
            return "Email already exists.";
        }

        if (!formData.username.trim()) {
            return "Username is required.";
        }

        if (duplicate("username")) {
            return "Username already exists.";
        }

        if (!formData.phone.trim()) {
            return "Phone number is required.";
        }

        if (!/^\d+$/.test(formData.phone)) {
            return "Phone number must contain only digits.";
        }

        if (formData.phone.length !== PHONE_LENGTH) {
            return "Phone number must be exactly 10 digits long.";
        }

        if (duplicate("phone")) {
            return "Phone number already exists.";
        }

        if (!isEdit && (!formData.password || formData.password.length < MIN_PASSWORD_LENGTH)) {
            return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
        }

        if (!formData.designation.trim()) {
            return "Designation is required.";
        }

        return null;
    };

    // Add employee
    const addEmployee = async () => {
        const errorMessage = validateEmployee(formData, employees);
        if (errorMessage) {
            toast.error(errorMessage);
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/api/employee/add`, formData);
            await fetchEmployees();
            closePopup();
            toast.success("Employee added successfully!");
        } catch (error) {
            toast.error("Error adding employee: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Update employee
    const updateEmployee = async () => {
        const errorMessage = validateEmployee(formData, employees, true);
        if (errorMessage) {
            toast.error(errorMessage);
            return;
        }

        setLoading(true);
        try {
            const id = localStorage.getItem("empId");
            await axios.put(`${BASE_URL}/api/employee/update/${id}`, formData);
            await fetchEmployees();
            closePopup();
            toast.success("Employee updated successfully!");
        } catch (error) {
            toast.error("Error updating employee: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete employee
    const deleteEmployee = async (id, name) => {
        const result = await Swal.fire({
            title: `Delete ${name}?`,
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            setLoading(true);
            try {
                await axios.delete(`${BASE_URL}/api/employee/delete/${id}`);
                await fetchEmployees();
                Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
            } catch (error) {
                Swal.fire('Error!', "Error deleting employee: " + error.message, 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    // Export employees to CSV
    const exportToCSV = () => {
        const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Designation', 'Role', 'Date of Birth'];
        const csvData = filteredEmployees.map(emp => [
            emp.empId,
            emp.fname,
            emp.lname,
            emp.email,
            emp.phone,
            emp.designation,
            emp.role,
            emp.dob
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${cell || ''}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `employees-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Employee data exported successfully!");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
                            <p className="text-gray-600">Manage organization's employees</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={exportToCSV}
                                className="bg-gray-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-1 sm:gap-2 transition-colors"
                                title="Export CSV"
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">Export CSV</span>
                            </button>
                            <button
                                onClick={fetchEmployees}
                                className="bg-blue-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1 sm:gap-2 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={16} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Role Filters */}
                        <div className="flex gap-2">
                            {[
                                { id: "all", label: "All", count: employees.length },
                                { id: "EMPLOYEE", label: "Employees", count: employees.filter(e => e.role === "EMPLOYEE").length },
                                { id: "ADMIN", label: "Admins", count: employees.filter(e => e.role === "ADMIN").length }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => filterByRole(tab.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeTab === tab.id ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </div>

                        {/* Add Employee Button */}
                        <button
                            onClick={() => openPopup("add")}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Add Employee
                        </button>
                    </div>
                </div>

                {/* Employee Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading employees...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Employee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Position
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredEmployees.map((emp) => (
                                            <tr key={emp.empId} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600">
                                                                {emp.fname.charAt(0)}{emp.lname.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {emp.fname} {emp.lname}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {emp.empId}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{emp.email}</div>
                                                    <div className="text-sm text-gray-500">{emp.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                        {emp.designation}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        emp.role === 'ADMIN' 
                                                            ? 'bg-purple-100 text-purple-800' 
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {emp.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openPopup("view", emp)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => openPopup("edit", emp)}
                                                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition-colors"
                                                            title="Edit Employee"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteEmployee(emp.empId, `${emp.fname} ${emp.lname}`)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                                            title="Delete Employee"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {filteredEmployees.length === 0 && (
                                <div className="text-center py-12">
                                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchQuery ? "Try adjusting your search criteria." : "Get started by adding a new employee."}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Employee Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredEmployees.length} of {employees.length} employees
                </div>
            </div>

            {/* Modal */}
            {showPopup && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {popupMode === "add" && "Add New Employee"}
                                {popupMode === "edit" && "Edit Employee"}
                                {popupMode === "view" && "Employee Details"}
                            </h2>
                            <button
                                onClick={closePopup}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form className="p-6 space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <CustomTooltip 
                                        content={validationErrors.username}
                                        isVisible={showTooltips.username && validationErrors.username}
                                        position="top"
                                    >
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                name="username"
                                                type="text"
                                                placeholder="Enter username"
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    validationErrors.username ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                                }`}
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                onFocus={() => handleFieldFocus('username')}
                                                onBlur={() => handleFieldBlur('username')}
                                                disabled={popupMode === "view"}
                                            />
                                            {validationErrors.username && (
                                                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={16} />
                                            )}
                                        </div>
                                    </CustomTooltip>
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role
                                    </label>
                                    <select
                                        name="role"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        disabled={popupMode === "view"}
                                    >
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>

                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <CustomTooltip 
                                        content={validationErrors.fname}
                                        isVisible={showTooltips.fname && validationErrors.fname}
                                        position="top"
                                    >
                                        <div className="relative">
                                            <input
                                                name="fname"
                                                type="text"
                                                placeholder="Enter first name"
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    validationErrors.fname ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                                }`}
                                                value={formData.fname}
                                                onChange={handleInputChange}
                                                onFocus={() => handleFieldFocus('fname')}
                                                onBlur={() => handleFieldBlur('fname')}
                                                disabled={popupMode === "view"}
                                            />
                                            {validationErrors.fname && (
                                                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={16} />
                                            )}
                                        </div>
                                    </CustomTooltip>
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <CustomTooltip 
                                        content={validationErrors.lname}
                                        isVisible={showTooltips.lname && validationErrors.lname}
                                        position="top"
                                    >
                                        <div className="relative">
                                            <input
                                                name="lname"
                                                type="text"
                                                placeholder="Enter last name"
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    validationErrors.lname ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                                }`}
                                                value={formData.lname}
                                                onChange={handleInputChange}
                                                onFocus={() => handleFieldFocus('lname')}
                                                onBlur={() => handleFieldBlur('lname')}
                                                disabled={popupMode === "view"}
                                            />
                                            {validationErrors.lname && (
                                                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={16} />
                                            )}
                                        </div>
                                    </CustomTooltip>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <CustomTooltip 
                                        content={validationErrors.email}
                                        isVisible={showTooltips.email && validationErrors.email}
                                        position="top"
                                    >
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="Enter email address"
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    validationErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                                }`}
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                onFocus={() => handleFieldFocus('email')}
                                                onBlur={() => handleFieldBlur('email')}
                                                disabled={popupMode === "view"}
                                            />
                                            {validationErrors.email && (
                                                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={16} />
                                            )}
                                        </div>
                                    </CustomTooltip>
                                </div>

                                {/* Password */}
                                {popupMode === "add" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <CustomTooltip 
                                            content={validationErrors.password}
                                            isVisible={showTooltips.password && validationErrors.password}
                                            position="top"
                                        >
                                            <div className="relative">
                                                <input
                                                    name="password"
                                                    type="password"
                                                    placeholder="Enter password"
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        validationErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                                    }`}
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    onFocus={() => handleFieldFocus('password')}
                                                    onBlur={() => handleFieldBlur('password')}
                                                />
                                                {validationErrors.password && (
                                                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={16} />
                                                )}
                                            </div>
                                        </CustomTooltip>
                                    </div>
                                )}

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone
                                    </label>
                                    <CustomTooltip 
                                        content={validationErrors.phone}
                                        isVisible={showTooltips.phone && validationErrors.phone}
                                        position="top"
                                    >
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                name="phone"
                                                type="tel"
                                                placeholder="Enter phone number"
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    validationErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                                }`}
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                onFocus={() => handleFieldFocus('phone')}
                                                onBlur={() => handleFieldBlur('phone')}
                                                disabled={popupMode === "view"}
                                            />
                                            {validationErrors.phone && (
                                                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={16} />
                                            )}
                                        </div>
                                    </CustomTooltip>
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth
                                    </label>
                                    <CustomTooltip 
                                        content={validationErrors.dob}
                                        isVisible={showTooltips.dob && validationErrors.dob}
                                        position="top"
                                    >
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                name="dob"
                                                type="date"
                                                max={(() => {
                                                    const today = new Date();
                                                    const minDate = new Date();
                                                    minDate.setFullYear(today.getFullYear() - 18);
                                                    return minDate.toISOString().split('T')[0];
                                                })()}
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    validationErrors.dob ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                                }`}
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                                onFocus={() => handleFieldFocus('dob')}
                                                onBlur={() => handleFieldBlur('dob')}
                                                disabled={popupMode === "view"}
                                            />
                                            {validationErrors.dob && (
                                                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={16} />
                                            )}
                                        </div>
                                    </CustomTooltip>
                                </div>

                                {/* Designation */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Designation
                                    </label>
                                    <CustomTooltip 
                                        content={validationErrors.designation}
                                        isVisible={showTooltips.designation && validationErrors.designation}
                                        position="top"
                                    >
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                name="designation"
                                                type="text"
                                                placeholder="Enter designation"
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    validationErrors.designation ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                                }`}
                                                value={formData.designation}
                                                onChange={handleInputChange}
                                                onFocus={() => handleFieldFocus('designation')}
                                                onBlur={() => handleFieldBlur('designation')}
                                                disabled={popupMode === "view"}
                                            />
                                            {validationErrors.designation && (
                                                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={16} />
                                            )}
                                        </div>
                                    </CustomTooltip>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={closePopup}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                {popupMode === "add" && (
                                    <button
                                        type="button"
                                        onClick={addEmployee}
                                        disabled={loading}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? "Adding..." : "Add Employee"}
                                    </button>
                                )}
                                {popupMode === "edit" && (
                                    <button
                                        type="button"
                                        onClick={updateEmployee}
                                        disabled={loading}
                                        className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? "Updating..." : "Update Employee"}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employee;