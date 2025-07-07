import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../api";
import { Clock, Edit2, FileText, LogIn, LogOut, DoorClosed, Sandwich, UtensilsCrossed } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmpTimesheet = () => {
    const empId = localStorage.getItem("userId");
    const [timesheets, setTimesheets] = useState([]);
    const [hasLoggedInToday, setHasLoggedInToday] = useState(false);
    // State for update actions
    const [lunchBreakStart, setLunchBreakStart] = useState(null); // lunchOutTime
    const [lunchBreakEnd, setLunchBreakEnd] = useState(null); // lunchInTime
    const [outInPairs, setOutInPairs] = useState([]); // [{out: 'HH:mm', in: 'HH:mm'}]
    const [currentOut, setCurrentOut] = useState(null); // temp store for out before in
    const [loggedOut, setLoggedOut] = useState(null); // endTime
    const [workSummary, setWorkSummary] = useState("");
    const [loginTime, setLoginTime] = useState(null); // startTime from today's timesheet
    const [updateDisabled, setUpdateDisabled] = useState(false);
    const [allDisabled, setAllDisabled] = useState(false); // disable all after logout
    const [todayAttendance, setTodayAttendance] = useState(null); // today's attendance status

    useEffect(() => {
        fetchTimesheets();
        checkLoggedInToday();
        fetchTodayAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch today's timesheet and set loginTime and logout status
    useEffect(() => {
        const today = getSLDate();
        const todaySheet = timesheets.find(ts => ts.date === today);
        if (todaySheet) {
            setLoginTime(todaySheet.startTime);
            if (todaySheet.endTime) {
                setLoggedOut(todaySheet.endTime); // set to endTime value (truthy)
                setAllDisabled(true); // Optionally disable all actions after logout
            } else {
                setLoggedOut(null);
                setAllDisabled(false);
            }
        } else {
            setLoginTime(null);
            setLoggedOut(null);
            setAllDisabled(false);
        }
    }, [timesheets]);

    // Check if user has already logged in today
    const checkLoggedInToday = () => {
        const today = getSLDate();
        setHasLoggedInToday(timesheets.some(ts => ts.date === today));
    };

    // get all timesheet by employee
    const fetchTimesheets = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/timesheet/timesheets`); // ${BASE_URL}
            const filtered = res.data.filter(ts => String(ts.employeeId) == String(empId));
            setTimesheets(filtered);
        } catch(err) {
            toast.error("Failed to fetch timesheets",err);
        }
    };

    // Fetch today's attendance status
    const fetchTodayAttendance = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/attendance/attendances`);
            const today = getSLDate();
            const todayAtt = res.data.find(att => String(att.empId) === String(empId) && att.date === today);
            setTodayAttendance(todayAtt ? todayAtt.status : null);
        } catch(err) {
            toast.error("Failed to fetch attendance", err);
        }
    };

    const handleLogIn = async () => {
        const today = getSLDate();
        const startTime = getSLTime(); // 'HH:mm'
        if (hasLoggedInToday || allDisabled) {
            toast.info('You already logged in for today.', { style: { background: '#fbbf24', color: '#fff' } });
            return;
        }
        try {
            await axios.post(`${BASE_URL}/api/timesheet/add`, {
                employee: { empId: empId },
                date: today,
                startTime: startTime
            });
            setHasLoggedInToday(true);
            fetchTimesheets();
            toast.success('Logged in successfully!', { style: { background: '#22c55e', color: '#fff' } });
        } catch {
            toast.error('Error logging in timesheet', { style: { background: '#ef4444', color: '#fff' } });
        }
    };
    
    // Button handlers
    const handleLunchBreakStart = () => {
        if (!loginTime) {
            toast.error('Please mark login first', { style: { background: '#ef4444', color: '#fff' } });
            return;
        }
        if (!lunchBreakStart) {
            setLunchBreakStart(getSLTime());
            toast.info('Lunch break started!', { style: { background: '#2563eb', color: '#fff' } });
        }
    };
    const handleLunchBreakEnd = () => {
        if (!loginTime) {
            toast.error('Please mark login first', { style: { background: '#ef4444', color: '#fff' } });
            return;
        }
        if (!lunchBreakEnd) {
            setLunchBreakEnd(getSLTime());
            toast.info('Lunch break ended!', { style: { background: '#2563eb', color: '#fff' } });
        }
    };
    const handleOut = () => {
        if (!loginTime) {
            toast.error('Please mark login first', { style: { background: '#ef4444', color: '#fff' } });
            return;
        }
        if (!currentOut) {
            setCurrentOut(getSLTime());
            toast.warning('Marked as Out!', { style: { background: '#f59e42', color: '#fff' } });
        }
    };
    const handleIn = () => {
        if (!loginTime) {
            toast.error('Please mark login first', { style: { background: '#ef4444', color: '#fff' } });
            return;
        }
        if (currentOut) {
            setOutInPairs([...outInPairs, { out: currentOut, in: getSLTime() }]);
            setCurrentOut(null);
            toast.warning('Marked as In!', { style: { background: '#0ea5e9', color: '#fff' } });
        }
    };
    const handleLoggedOut = async () => {
        if (!loginTime || loggedOut) {
            if (loggedOut) {
                toast.info('You have already logged out today', { style: { background: '#fbbf24', color: '#fff' } });
            } else if (!loginTime) {
                toast.error('Please mark login first', { style: { background: '#ef4444', color: '#fff' } });
            }
            return;
        }
        
        // Check if work summary is filled
        if (!workSummary.trim()) {
            toast.error('Please fill the work summary before logging out', { style: { background: '#ef4444', color: '#fff' } });
            return;
        }
        
        const endTime = getSLTime();
        setLoggedOut(endTime);
        setUpdateDisabled(true);
        // Calculate durations
        const toMinutes = t => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
        };
        
        // Convert minutes to "X hr Y min" format
        const formatWorkHours = (totalMinutes) => {
            if (totalMinutes <= 0) return "0 hr 0 min";
            const hours = Math.floor(totalMinutes / 60);
            const minutes = Math.round(totalMinutes % 60);
            return `${hours} hr ${minutes} min`;
        };
        
        let lunchDuration = 0;
        if (lunchBreakStart && lunchBreakEnd) {
            lunchDuration = toMinutes(lunchBreakEnd) - toMinutes(lunchBreakStart);
        }
        
        let outDuration = 0;
        outInPairs.forEach(pair => {
            outDuration += toMinutes(pair.in) - toMinutes(pair.out);
        });
        
        // Work hours calculation
        const totalWorkMinutes = toMinutes(endTime) - toMinutes(loginTime) - lunchDuration - outDuration;
        const workHours = formatWorkHours(totalWorkMinutes);
        // Get today's timesheetId
        const empId = localStorage.getItem("empId") || localStorage.getItem("userId");
        const date = getSLDate();
        let timesheetId = null;
        try {
            const res = await axios.get(`${BASE_URL}/api/timesheet/get-id/${empId}/${date}`);
            timesheetId = res.data;
        } catch {
            toast.error("Could not get today's timesheet ID", { style: { background: '#ef4444', color: '#fff' } });
            return;
        }
        // Prepare update data
        const updateData = {
            lunchOutTime: lunchBreakStart,
            lunchInTime: lunchBreakEnd,
            outTime: outInPairs.length > 0 ? outInPairs[outInPairs.length-1].out : null,
            inTime: outInPairs.length > 0 ? outInPairs[outInPairs.length-1].in : null,
            endTime: endTime,
            workHours: workHours,
            workSummery: workSummary
        };
        try {
            await axios.put(`${BASE_URL}/api/timesheet/update/${timesheetId}`, updateData);
            // Update attendance logout time
            try {
                // Fetch all attendance records for this employee
                const attendanceRes = await axios.get(`${BASE_URL}/api/attendance/attendances`);
                const todayAttendance = attendanceRes.data.find(att => String(att.empId) === String(empId) && att.date === date);
                if (todayAttendance) {
                    await axios.put(`${BASE_URL}/api/attendance/update/${todayAttendance.attId}`, { loggedOutTime: getSLTime() });
                    toast.success('Attendance logout time updated!', { style: { background: '#22c55e', color: '#fff' } });
                } else {
                    toast.warn('No attendance record found for today to update logout time.', { style: { background: '#fbbf24', color: '#fff' } });
                }
            } catch {
                toast.error('Error updating attendance logout time', { style: { background: '#ef4444', color: '#fff' } });
            }
            fetchTimesheets();
            toast.success('Logged out and timesheet updated!', { style: { background: '#334155', color: '#fff' } });
            setWorkSummary("");
            setAllDisabled(true);
        } catch {
            toast.error('Error updating timesheet', { style: { background: '#ef4444', color: '#fff' } });
        }
    };

    const getSLDate = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' }); // YYYY-MM-DD
    const getSLTime = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Colombo' }); // HH:mm

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Timesheet</h1>
                    <p className="text-gray-600">Add and update your daily timesheet records.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Today</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            {/* Timesheet Actions Grid */}
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            
            {/* Attendance Check Message */}
            {todayAttendance === null && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock size={20} className="text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-800">Attendance Required</h3>
                            <p className="text-yellow-700">Please mark your attendance to mark timesheet</p>
                        </div>
                    </div>
                </div>
            )}
            
            {todayAttendance === 'ABSENT' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle size={20} className="text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-red-800">Cannot Mark Timesheet</h3>
                            <p className="text-red-700">You are absent today, you cannot mark timesheet</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {todayAttendance === 'PRESENT' ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <button
                        onClick={handleLogIn}
                        className={`flex items-center justify-center gap-2 py-2 rounded transition text-white font-semibold text-base 
                            ${hasLoggedInToday || allDisabled ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700'}`}
                        disabled={hasLoggedInToday || allDisabled}
                    >
                        <LogIn size={20} />
                        {hasLoggedInToday ? 'Logged In' : 'Log in'}
                    </button>
                    <button
                        onClick={handleLunchBreakStart}
                        className={`flex items-center justify-center gap-2 py-2 rounded transition text-white font-semibold text-base 
                            ${lunchBreakStart || allDisabled ? 'bg-blue-200 cursor-not-allowed' : 'bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700'}`}
                        disabled={!!lunchBreakStart || allDisabled}
                    >
                        <Sandwich size={20} />
                        {lunchBreakStart ? `Lunch Started` : 'Lunch Break Start'}
                    </button>
                    <button
                        onClick={handleLunchBreakEnd}
                        className={`flex items-center justify-center gap-2 py-2 rounded transition text-white font-semibold text-base 
                            ${lunchBreakEnd || allDisabled ? 'bg-indigo-200 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700'}`}
                        disabled={!!lunchBreakEnd || allDisabled}
                    >
                        <UtensilsCrossed size={20} />
                        {lunchBreakEnd ? `Lunch Ended` : 'Lunch Break End'}
                    </button>
                    <button
                        onClick={handleOut}
                        className={`flex items-center justify-center gap-2 py-2 rounded transition text-white font-semibold text-base 
                            ${currentOut || allDisabled ? 'bg-orange-200 cursor-not-allowed' : 'bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700'}`}
                        disabled={!!currentOut || allDisabled}
                    >
                        <LogOut size={20} />
                        {currentOut ? `Out` : 'Out'}
                    </button>
                    <button
                        onClick={handleIn}
                        className={`flex items-center justify-center gap-2 py-2 rounded transition text-white font-semibold text-base 
                            ${!currentOut || allDisabled ? 'bg-cyan-200 cursor-not-allowed' : 'bg-gradient-to-r from-green-700 to-green-900 hover:from-green-800 hover:to-green-950'}`}
                        disabled={!currentOut || allDisabled}
                    >
                        <LogIn size={20} />
                        In
                    </button>
                    <button
                        onClick={handleLoggedOut}
                        className={`flex items-center justify-center gap-2 py-2 rounded transition text-white font-semibold text-base 
                            ${loggedOut || allDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-gray-500 to-gray-800 hover:from-gray-600 hover:to-gray-900'}`}
                        disabled={updateDisabled || !loginTime || loggedOut || allDisabled}
                    >
                        <DoorClosed size={20} />
                        {loggedOut ? `Logged Out` : 'Logged Out'}
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Summary</label>
                    <textarea
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-400 focus:outline-none"
                        rows={3}
                        value={workSummary}
                        onChange={e => setWorkSummary(e.target.value)}
                        placeholder="Describe your work for the day..."
                    />
                </div>
                {/* Show out/in pairs for the day */}
                {outInPairs.length > 0 && (
                    <div className="text-sm text-gray-600 mt-4">
                        <div className="font-semibold mb-1">Out/In Pairs:</div>
                        <ul className="list-disc ml-5">
                            {outInPairs.map((pair, idx) => (
                                <li key={idx}>Out: {pair.out}, In: {pair.in}</li>
                            ))}
                        </ul>
                    </div>
                )}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                            {todayAttendance === null ? 'Attendance Required' : 'Cannot Mark Timesheet'}
                        </h3>
                        <p className="text-gray-500">
                            {todayAttendance === null 
                                ? 'Please mark your attendance as "Present" to access timesheet features.' 
                                : 'You are marked as absent today. Timesheet features are not available.'
                            }
                        </p>
                    </div>
                )}
            </div>
            {/* Timesheet Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><FileText size={22} />Timesheet Records</h4>
                <div className="overflow-x-auto overflow-y-auto max-h-[500px] max-md:max-w-[300px]">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-cyan-600 text-white sticky top-0 z-10">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold">ID</th>  
                                <th className="p-3 text-left text-sm font-semibold">Date</th>
                                <th className="p-3 text-left text-sm font-semibold">StartTime</th>
                                <th className="p-3 text-left text-sm font-semibold">OutTime</th>
                                <th className="p-3 text-left text-sm font-semibold">InTime</th>
                                <th className="p-3 text-left text-sm font-semibold">LunchOut</th>
                                <th className="p-3 text-left text-sm font-semibold">LunchIn</th>
                                <th className="p-3 text-left text-sm font-semibold">EndTime</th>
                                <th className="p-3 text-left text-sm font-semibold">Work Hours</th>
                                <th className="p-3 text-left text-sm font-semibold">Work Summary</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {timesheets.length > 0 ? (
                                timesheets.map((ts) => (
                                    <tr
                                        key={ts.timesheetId}
                                        className="hover:bg-gray-100 transition border-b border-gray-200"
                                    >
                                        <td className="p-3">{ts.timesheetId}</td>
                                        <td className="p-3">{ts.date}</td>
                                        <td className="p-3">{ts.startTime}</td>
                                        <td className="p-3">{ts.outTime}</td>
                                        <td className="p-3">{ts.inTime}</td>
                                        <td className="p-3">{ts.lunchOutTime}</td>
                                        <td className="p-3">{ts.lunchInTime}</td>
                                        <td className="p-3">{ts.endTime}</td>
                                        <td className="p-3">{ts.workHours}</td>
                                        <td className="p-3">{ts.workSummery}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center p-4 text-gray-500">
                                        No timesheet data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmpTimesheet;
