import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomTooltip from '../../components/CustomTooltip';
import BASE_URL from '../../api.js';
import { Eye, EyeOff } from 'lucide-react';

const initialState = {
  firstName: '',
  lastName: '',
  username: '',
  designation: '',
  email: '',
  password: '',
  phone: '',
  dob: '2004-01-01', // Prefill
};

const initialErrors = {
  firstName: '',
  lastName: '',
  username: '',
  designation: '',
  email: '',
  password: '',
  phone: '',
  dob: '',
};

function SignUp() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({});
  const [allowedEmails, setAllowedEmails] = useState([]); // <-- NEW
  const [loadingEmails, setLoadingEmails] = useState(true); // <-- NEW
  const [showPassword, setShowPassword] = useState(false); // <-- NEW
  const navigate = useNavigate();

  // Fetch allowed emails on mount
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/email/emails`);
        setAllowedEmails(res.data);
      } catch {
        setAllowedEmails([]);
      } finally {
        setLoadingEmails(false);
      }
    };
    fetchEmails();
  }, []);

  // Validation functions
  const onlyLetters = /^[A-Za-z]+$/;
  const emailRegex = /^[^\s@]+@rubaai\.net$/;
  const phoneRegex = /^\d{10}$/;
  const minDOB = new Date('1970-01-01');
  const today = new Date();

  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,12}$/;

  const validate = (field, value) => {
    if (field === 'firstName' || field === 'lastName' || field === 'username' || field === 'designation') {
      if (!value) return 'Required';
      if (!onlyLetters.test(value)) return 'Only letters allowed';
      return '';
    } else if (field === 'email') {
      if (!value) return 'Required';
      if (!emailRegex.test(value)) return 'Must be a @rubaai.net email';
      if (!loadingEmails) {
        const found = allowedEmails.find(e => e.email === value);
        if (!found) return 'Invalid email';
        if (found.status !== 'ACTIVE') return 'Email inactive';
      }
      return '';
    } else if (field === 'password') {
      if (!value) return 'Required';
      if (value.length < 8 || value.length > 12) return 'Password must be 8-12 characters';
      if (!passwordRegex.test(value)) return 'Must have 1 uppercase, 1 lowercase, 1 number, 1 symbol';
      return '';
    } else if (field === 'phone') {
      if (!value) return 'Required';
      if (!phoneRegex.test(value)) return 'Must be 10 digits';
      return '';
    } else if (field === 'dob') {
      if (!value) return 'Required';
      const dobDate = new Date(value);
      if (dobDate > today) return 'Cannot be in the future';
      if (dobDate < minDOB) return 'DOB must be after Jan 1, 1970';
      return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const isFormValid = () => {
    const newErrors = {};
    let valid = true;
    Object.keys(form).forEach((field) => {
      const err = validate(field, form[field]);
      newErrors[field] = err;
      if (err) valid = false;
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Please fix the errors in the form.');
      return;
    }
    try {
      // Map firstName/lastName to fname/lname for backend
      const payload = {
        ...form,
        fname: form.firstName,
        lname: form.lastName,
        role: 'EMPLOYEE',
      };
      delete payload.firstName;
      delete payload.lastName;
      await axios.post(`${BASE_URL}/api/employee/add`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Sign up successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      toast.error(`Sign up failed. Please try again.${err.response ? ` Error: ${err.response.data.message}` : ''  }`);
    }
  };

  // For date picker
  const maxDate = today.toISOString().split('T')[0];
  const minDate = minDOB.toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
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
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h1>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
            Rubaai Employee Management System
          </h2>
          <p className="text-gray-600 text-sm">Fill in the details to sign up</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <CustomTooltip content={errors.firstName} isVisible={!!errors.firstName && touched.firstName} position="top">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm ${errors.firstName && touched.firstName ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  placeholder="Enter your first name"
                />
              </div>
            </CustomTooltip>
            {/* Last Name */}
            <CustomTooltip content={errors.lastName} isVisible={!!errors.lastName && touched.lastName} position="top">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm ${errors.lastName && touched.lastName ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  placeholder="Enter your last name"
                />
              </div>
            </CustomTooltip>
            {/* Username */}
            <CustomTooltip content={errors.username} isVisible={!!errors.username && touched.username} position="top">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm ${errors.username && touched.username ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  placeholder="Enter your username"
                />
              </div>
            </CustomTooltip>
            {/* Designation */}
            <CustomTooltip content={errors.designation} isVisible={!!errors.designation && touched.designation} position="top">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm ${errors.designation && touched.designation ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  placeholder="Enter your designation"
                />
              </div>
            </CustomTooltip>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <CustomTooltip content={errors.email} isVisible={!!errors.email && touched.email} position="top">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm ${errors.email && touched.email ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  placeholder="Use the Provided email here"
                />
              </div>
            </CustomTooltip>
            {/* Password */}
            <CustomTooltip content={errors.password} isVisible={!!errors.password && touched.password} position="top">
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm ${errors.password && touched.password ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  placeholder="Enter a strong password"
                />
                <span className="absolute right-3 top-1/2  flex items-center">
                  <button
                    type="button"
                    tabIndex={-1}
                    className="text-gray-400 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </span>
              </div>
            </CustomTooltip>
          </div>

          {/* Phone, Date of Birth Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <CustomTooltip content={errors.phone} isVisible={!!errors.phone && touched.phone} position="top">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm ${errors.phone && touched.phone ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  placeholder="10 digit phone number"
                  maxLength={10}
                />
              </div>
            </CustomTooltip>
            {/* Date of Birth */}
            <CustomTooltip content={errors.dob} isVisible={!!errors.dob && touched.dob} position="top">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm ${errors.dob && touched.dob ? 'border-red-400' : 'border-gray-300'}`}
                  required
                  min={minDate}
                  max={maxDate}
                />
              </div>
            </CustomTooltip>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
          <div className="text-center pt-4">
            <span className="text-gray-600 text-sm">Already have an account?</span>
            <button
              type="button"
              className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-semibold underline"
              onClick={() => navigate('/')}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;