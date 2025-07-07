import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import BASE_URL from './../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'lucide-react';
import CustomTooltip from '../../components/CustomTooltip';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showEmailTooltip, setShowEmailTooltip] = useState(false);
    const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        // console.log("BASE_URL:", import.meta.env.VITE_BASE_URL);
        if (error) {
            const timer = setTimeout(() => {
                // setError(null);
                // alert(error);
                setError('');
        }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);
// ------ CHECK EMAIL FORMAT --------
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
// ------ SUBMIT LOGIN FORM --------
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginDetails = {
                email: email,
                password: password
            }
        if (!email || !password) {
            toast.error('Email and password are required');
            return;
        }
        if (!isValidEmail(email)) {
            toast.error("Invalid email address");
            return;
        } else {
            setError("");
        }
        // Only allow @rubaai.net emails
        if (!email.endsWith('@rubaai.net')) {
            toast.error('Please use your @rubaai.net email to log in.');
            return;
        }

        try{
            const res = await axios.post(`${BASE_URL}/api/auth/login`, loginDetails, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(res.data.id){
                localStorage.setItem('userId', res.data.id);
                localStorage.setItem('userEmail', res.data.email);
                localStorage.setItem('userRole', res.data.role);
                localStorage.setItem('userName', res.data.name);
                // console.log(res.data.role);

                toast.success('Login successful!');
                if (res.data.role === 'ADMIN') navigate('/admin');
                else if (res.data.role === 'EMPLOYEE') navigate('/employee');
                else toast.error('Unknown role');
            }else{
                toast.error('Invalid Credentials');
            }
        } catch (err) {
            toast.error('Invalid email or password',err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <ToastContainer
                position="top-right"
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
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
                {/* Welcome Text */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to</h1>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
                        Rubaai Employee Management System
                    </h2>
                    <p className="text-gray-600 text-sm">Please sign in to continue</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-3 text-sm">
                            Email Address
                        </label>
                        <CustomTooltip 
                            content="Use your @rubaai.net email address"
                            isVisible={showEmailTooltip && !email.endsWith('@rubaai.net')}
                            position="top"
                        >
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onMouseEnter={() => !email.endsWith('@rubaai.net') && setShowEmailTooltip(true)}
                                    onMouseLeave={() => setShowEmailTooltip(false)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-blue-400"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                            </div>
                        </CustomTooltip>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-3 text-sm">
                            Password
                        </label>
                        <CustomTooltip 
                            content="Enter your secure password."
                            isVisible={showPasswordTooltip}
                            position="top"
                        >
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onMouseEnter={() => setShowPasswordTooltip(true)}
                                    onMouseLeave={() => setShowPasswordTooltip(false)}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-blue-400"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </CustomTooltip>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm font-medium text-center">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center pt-4">
                        <p className="text-gray-500 text-xs">
                            Secure access to your employee portal
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
