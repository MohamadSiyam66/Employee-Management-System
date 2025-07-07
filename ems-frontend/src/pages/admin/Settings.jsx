import { useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../api';
import CustomTooltip from '../../components/CustomTooltip';

const Settings = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
    const [newPasswordValidation, setNewPasswordValidation] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const validateCurrentPassword = async (password) => {
        if (!password) {
            setCurrentPasswordError('');
            setIsCurrentPasswordValid(false);
            return;
        }

        try {
            const userId = localStorage.getItem('userId');

            const response = await fetch(`${BASE_URL}/api/employee/employee/${userId}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.password === password) {
                    setCurrentPasswordError('');
                    setIsCurrentPasswordValid(true);
                } else {
                    setCurrentPasswordError('Current password is incorrect');
                    setIsCurrentPasswordValid(false);
                }
            } else {
                setCurrentPasswordError('Failed to verify password');
                setIsCurrentPasswordValid(false);
            }
        } catch (error) {
            setCurrentPasswordError(`Network error. Please try again. ${error.message}`);
            setIsCurrentPasswordValid(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear current password error when user types
        if (name === 'currentPassword') {
            setCurrentPasswordError('');
            setIsCurrentPasswordValid(false);
            // Validate current password after a short delay
            const timeoutId = setTimeout(() => {
                validateCurrentPassword(value);
            }, 500);
            return () => clearTimeout(timeoutId);
        }

        // Only allow new password entry if current password is valid
        if (name === 'newPassword' && !isCurrentPasswordValid) {
            return;
        }

        // Validate new password
        if (name === 'newPassword') {
            validateNewPassword(value);
        }
    };

    const validateNewPassword = (password) => {
        setNewPasswordValidation({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.error('All fields are required');
            return false;
        }

        if (!isCurrentPasswordValid) {
            toast.error('Please enter a valid current password');
            return false;
        }

        // Check if all password validation criteria are met
        const allValid = Object.values(newPasswordValidation).every(valid => valid);
        if (!allValid) {
            toast.error('New password does not meet all requirements');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New password and confirm password do not match');
            return false;
        }

        if (formData.currentPassword === formData.newPassword) {
            toast.error('New password must be different from current password');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            // First, verify current password by fetching employee data
            const verifyResponse = await fetch(`${BASE_URL}/api/employee/employee/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!verifyResponse.ok) {
                toast.error('Failed to verify current password');
                return;
            }

            const employeeData = await verifyResponse.json();
            
            // Update employee data with new password
            const updateData = {
                ...employeeData,
                password: formData.newPassword
            };

            const response = await fetch(`${BASE_URL}/api/employee/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password updated successfully!');
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setNewPasswordValidation({
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    number: false,
                    special: false
                });
                setIsCurrentPasswordValid(false);
            } else {
                toast.error(data.message || 'Failed to update password');
            }
        } catch (error) {
            toast.error(`Network error. Please try again. ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
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
            <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
                        <p className="text-gray-600">Manage your account settings and security preferences</p>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {/* Password Reset Section */}
                        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Reset Password</h2>
                                <p className="text-gray-600">Update your password to keep your account secure</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <CustomTooltip 
                                        content={currentPasswordError}
                                        isVisible={!!currentPasswordError}
                                        position="bottom"
                                    >
                                        <div className="relative">
                                            <input
                                                type={showPasswords.current ? 'text' : 'password'}
                                                id="currentPassword"
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                    currentPasswordError ? 'border-red-300' : isCurrentPasswordValid ? 'border-green-300' : 'border-gray-300'
                                                }`}
                                                placeholder="Enter your current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('current')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </CustomTooltip>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            disabled={!isCurrentPasswordValid}
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                !isCurrentPasswordValid ? 'bg-gray-100 cursor-not-allowed' : ''
                                            }`}
                                            placeholder={isCurrentPasswordValid ? "Enter your new password" : "Please enter current password first"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            disabled={!isCurrentPasswordValid}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                                        >
                                            {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    
                                    {/* Password Validation Tooltip */}
                                    {isCurrentPasswordValid && (
                                        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                                            <div className="space-y-1">
                                                <div className={`flex items-center space-x-2 text-sm ${newPasswordValidation.length ? 'text-green-600' : 'text-gray-500'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${newPasswordValidation.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span>At least 8 characters long</span>
                                                </div>
                                                <div className={`flex items-center space-x-2 text-sm ${newPasswordValidation.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${newPasswordValidation.uppercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span>Contains uppercase letter (A-Z)</span>
                                                </div>
                                                <div className={`flex items-center space-x-2 text-sm ${newPasswordValidation.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${newPasswordValidation.lowercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span>Contains lowercase letter (a-z)</span>
                                                </div>
                                                <div className={`flex items-center space-x-2 text-sm ${newPasswordValidation.number ? 'text-green-600' : 'text-gray-500'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${newPasswordValidation.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span>Contains number (0-9)</span>
                                                </div>
                                                <div className={`flex items-center space-x-2 text-sm ${newPasswordValidation.special ? 'text-green-600' : 'text-gray-500'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${newPasswordValidation.special ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <span>Contains special character (!@#$%^&*)</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            disabled={!isCurrentPasswordValid}
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                !isCurrentPasswordValid ? 'bg-gray-100 cursor-not-allowed' : ''
                                            }`}
                                            placeholder={isCurrentPasswordValid ? "Confirm your new password" : "Please enter current password first"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            disabled={!isCurrentPasswordValid}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                                        >
                                            {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && isCurrentPasswordValid && (
                                        <div className="flex items-center space-x-2 mt-2 text-red-600 text-sm">
                                            <Info size={16} />
                                            <span>Passwords do not match</span>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !isCurrentPasswordValid}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Updating Password...' : 'Update Password'}
                                </button>
                            </form>
                        </div>

                        {/* Account Information Section */}
                        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Account Information</h2>
                                <p className="text-gray-600">View your account details</p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-700">Name</span>
                                    <span className="font-medium text-gray-900">{localStorage.getItem('userName')}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-700">Role</span>
                                    <span className="font-medium text-gray-900 capitalize">{localStorage.getItem('userRole')?.toLowerCase()}</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-gray-700">Admin ID</span>
                                    <span className="font-medium text-gray-900">{localStorage.getItem('userId')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 