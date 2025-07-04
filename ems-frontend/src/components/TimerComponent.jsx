import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '../api';
import { 
    saveWorkLogToPublicFolder,
    formatTime, 
    formatTimeForDisplay,
    getTimerStateFromStorage,
    saveTimerStateToStorage,
    clearTimerStateFromStorage
} from '../utils/timerUtils';
import { Play, Pause, Square, Coffee, Clock } from 'lucide-react';

const TimerComponent = ({ employeeId, employeeName }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [timerState, setTimerState] = useState('stopped'); // stopped, running, paused
    const [workDuration, setWorkDuration] = useState(0); // in seconds
    const [startTime, setStartTime] = useState(null);
    const [pauseTime, setPauseTime] = useState(0);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [blockers, setBlockers] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    const intervalRef = useRef(null);
    const currentDate = new Date().toISOString().split('T')[0];

    // Load timer state from localStorage on component mount
    useEffect(() => {
        const savedState = getTimerStateFromStorage(employeeId, currentDate);
        if (savedState) {
            setTimerState(savedState.timerState);
            setWorkDuration(savedState.workDuration);
            setStartTime(savedState.startTime ? new Date(savedState.startTime) : null);
            setPauseTime(savedState.pauseTime);
        }
    }, [employeeId, currentDate]);

    // Save timer state to localStorage whenever it changes
    useEffect(() => {
        const timerData = {
            timerState,
            workDuration,
            startTime: startTime?.toISOString(),
            pauseTime,
            date: currentDate
        };
        saveTimerStateToStorage(employeeId, currentDate, timerData);
    }, [timerState, workDuration, startTime, pauseTime, employeeId, currentDate]);

    // Update current time every second
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timeInterval);
    }, []);

    // Timer logic
    useEffect(() => {
        if (timerState === 'running') {
            intervalRef.current = setInterval(() => {
                setWorkDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [timerState]);

    // Reset timer at midnight
    useEffect(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeUntilMidnight = tomorrow - now;
        
        const resetTimer = setTimeout(() => {
            resetTimerState();
        }, timeUntilMidnight);

        return () => clearTimeout(resetTimer);
    }, [currentDate]);

    const resetTimerState = () => {
        setTimerState('stopped');
        setWorkDuration(0);
        setStartTime(null);
        setPauseTime(0);
        clearTimerStateFromStorage(employeeId, currentDate);
    };

    const handleLogIn = () => {
        setTimerState('running');
        setStartTime(new Date());
        setPauseTime(0);
        showToast('Timer started!', 'success');
    };

    const handleLunchBreak = () => {
        if (timerState === 'running') {
            setTimerState('paused');
            setPauseTime(workDuration);
            showToast('Break started!', 'info');
        }
    };

    const handleLunchBreakOver = () => {
        if (timerState === 'paused') {
            setTimerState('running');
            showToast('Break ended!', 'success');
        }
    };

    const handleLogOut = () => {
        if (timerState !== 'stopped') {
            setTimerState('stopped');
            setShowLogoutModal(true);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleSubmitLog = async () => {
        setIsSubmitting(true);
        let apiSuccess = false;
        let fileSuccess = false;
        
        try {
            const logData = {
                employeeId: employeeId,
                employeeName: employeeName,
                workDuration: formatTime(workDuration),
                workDurationSeconds: workDuration,
                date: currentDate,
                blockers: blockers,
                startTime: startTime?.toISOString(),
                endTime: new Date().toISOString()
            };

            // Save to backend API
            try {
                await axios.post(`${BASE_URL}/api/timesheet/add`, {
                    empId: employeeId,
                    date: currentDate,
                    startTime: startTime?.toISOString(),
                    endTime: new Date().toISOString(),
                    workHours: (workDuration / 3600).toFixed(2),
                    blockers: blockers
                });
                apiSuccess = true;
                console.log('Work log saved to API successfully');
            } catch (apiError) {
                console.error('API Error:', apiError);
                apiSuccess = false;
            }

            // Save to public folder file
            try {
                const fileSaved = await saveWorkLogToPublicFolder(logData);
                fileSuccess = fileSaved;
                if (fileSaved) {
                    console.log('Work log saved to file successfully');
                }
            } catch (fileError) {
                console.error('File Save Error:', fileError);
                fileSuccess = false;
            }

            // Show appropriate success/error messages
            if (apiSuccess && fileSuccess) {
                showToast('Work log saved successfully to both API and file!', 'success');
            } else if (apiSuccess && !fileSuccess) {
                showToast('Work log saved to API, but file save failed', 'warning');
            } else if (!apiSuccess && fileSuccess) {
                showToast('Work log saved to file, but API save failed', 'warning');
            } else {
                showToast('Both API and file save failed. Please try again.', 'error');
                return; // Don't close modal if both failed
            }

            // Close modal and reset timer only if at least one save was successful
            setShowLogoutModal(false);
            setBlockers('');
            resetTimerState();
            
        } catch (error) {
            console.error('Unexpected error in handleSubmitLog:', error);
            showToast('Unexpected error occurred. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-900 text-sm">Work Timer</h3>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                    {currentTime.toLocaleTimeString()}
                </div>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-4">
                <div className="text-2xl font-mono font-bold text-blue-600">
                    {formatTime(workDuration)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {timerState === 'running' ? 'Working' : timerState === 'paused' ? 'On Break' : 'Not Started'}
                </div>
            </div>

            {/* Compact Controls */}
            <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                    onClick={handleLogIn}
                    disabled={timerState !== 'stopped'}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        timerState === 'stopped'
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    <Play size={12} />
                    Start
                </button>
                
                <button
                    onClick={timerState === 'running' ? handleLunchBreak : handleLunchBreakOver}
                    disabled={timerState === 'stopped'}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        timerState !== 'stopped'
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    <Coffee size={12} />
                    {timerState === 'running' ? 'Break' : 'Resume'}
                </button>
                
                <button
                    onClick={handleLogOut}
                    disabled={timerState === 'stopped'}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        timerState !== 'stopped'
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    <Square size={12} />
                    Stop
                </button>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    timerState === 'running' 
                        ? 'bg-green-100 text-green-800' 
                        : timerState === 'paused' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        timerState === 'running' 
                            ? 'bg-green-500 animate-pulse' 
                            : timerState === 'paused' 
                            ? 'bg-yellow-500' 
                            : 'bg-gray-500'
                    }`}></div>
                    {timerState === 'running' ? 'Active' : timerState === 'paused' ? 'Paused' : 'Idle'}
                </div>
            </div>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">End Work Session</h3>
                        </div>
                        
                        <div className="p-4 space-y-3">
                            <div className="text-center">
                                <p className="text-xs text-gray-600 mb-1">Total Work Duration:</p>
                                <p className="text-lg font-bold text-blue-600">{formatTimeForDisplay(workDuration)}</p>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Any blockers today? (optional)
                                </label>
                                <textarea
                                    value={blockers}
                                    onChange={(e) => setBlockers(e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    rows="2"
                                    placeholder="Describe any issues..."
                                />
                            </div>
                        </div>
                        
                        <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-3 py-1 text-xs text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitLog}
                                disabled={isSubmitting}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 text-sm ${
                    toast.type === 'success' 
                        ? 'bg-green-500 text-white' 
                        : toast.type === 'error' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-blue-500 text-white'
                }`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default TimerComponent; 