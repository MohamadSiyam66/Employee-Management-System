import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import BASE_URL from './../../api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            setError('!! Email and password are required');
            return;
        }
        if (!isValidEmail(email)) {
            setError("!! Invalid email address");
            return;
        } else {
            setError("");
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

                if (res.data.role === 'ADMIN') navigate('/admin');
                else if (res.data.role === 'EMPLOYEE') navigate('/employee');
                else alert('Unknown role');
            }else{
                alert('Invalid Credentials');
            }
        } catch (err) {
            alert('Invalid email or password '+ err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-cyan-700 mb-6">Login</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
                        required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
                        <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
                        required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                        type="submit"
                        className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700 transition duration-200 shadow-md"
                        >
                        Login
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-sm font-medium text-center">
                        {error}
                        </p>
                    )}
                </form>
            </div>
        </div>

    );
}

export default Login;
