import React, { useState, useEffect } from 'react';
import { Clock, Users, UserCheck, Pause } from 'lucide-react';
import { getTimerStateFromStorage, formatTimeForDisplay } from '../utils/timerUtils';

const AdminTimerOverview = ({ employees }) => {
    const [timerStates, setTimerStates] = useState({});
    const currentDate = new Date().toISOString().split('T')[0];

    // Load initial timer states from localStorage
    useEffect(() => {
        const states = {};
        employees.forEach(employee => {
            const savedState = getTimerStateFromStorage(employee.empId, currentDate);
            if (savedState) {
                states[employee.empId] = savedState;
            }
        });
        setTimerStates(states);
    }, [employees, currentDate]);

    // Update timer states every second for running timers
    useEffect(() => {
        const interval = setInterval(() => {
            setTimerStates(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(empId => {
                    const state = updated[empId];
                    if (state && state.timerState === 'running') {
                        updated[empId] = {
                            ...state,
                            workDuration: state.workDuration + 1
                        };
                    }
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getActiveEmployees = () => {
        return employees.filter(emp => {
            const state = timerStates[emp.empId];
            return state && (state.timerState === 'running' || state.timerState === 'paused');
        });
    };

    const getWorkingEmployees = () => {
        return employees.filter(emp => {
            const state = timerStates[emp.empId];
            return state && state.timerState === 'running';
        });
    };

    const getOnBreakEmployees = () => {
        return employees.filter(emp => {
            const state = timerStates[emp.empId];
            return state && state.timerState === 'paused';
        });
    };

    const activeEmployees = getActiveEmployees();
    const workingEmployees = getWorkingEmployees();
    const onBreakEmployees = getOnBreakEmployees();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <Clock size={24} className="text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Employee Work Timers</h2>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Users size={20} className="text-blue-600" />
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Active Employees</p>
                            <p className="text-2xl font-bold text-blue-900">{activeEmployees.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <UserCheck size={20} className="text-green-600" />
                        <div>
                            <p className="text-sm text-green-600 font-medium">Currently Working</p>
                            <p className="text-2xl font-bold text-green-900">{workingEmployees.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Pause size={20} className="text-yellow-600" />
                        <div>
                            <p className="text-sm text-yellow-600 font-medium">On Break</p>
                            <p className="text-2xl font-bold text-yellow-900">{onBreakEmployees.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Employee List */}
            {activeEmployees.length > 0 ? (
                <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 mb-3">Active Employees</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {activeEmployees.map(employee => {
                            const state = timerStates[employee.empId];
                            const isWorking = state?.timerState === 'running';
                            const duration = state?.workDuration || 0;
                            
                            return (
                                <div key={employee.empId} className="border rounded-lg p-3 border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            isWorking ? 'bg-green-100' : 'bg-yellow-100'
                                        }`}>
                                            <span className={`text-xs font-semibold ${
                                                isWorking ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                                {employee.fname?.charAt(0)}{employee.lname?.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm truncate">
                                                {employee.fname} {employee.lname}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {employee.designation}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className={`flex items-center gap-1 text-xs ${
                                            isWorking ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            <div className={`w-2 h-2 rounded-full ${
                                                isWorking ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                                            }`}></div>
                                            <span className="font-medium">
                                                {isWorking ? 'Working' : 'On Break'}
                                            </span>
                                        </div>
                                        <span className="text-xs font-mono text-gray-600">
                                            {formatTimeForDisplay(duration)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <Clock size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No active employees at the moment</p>
                    <p className="text-sm">Employees will appear here when they start their work timer</p>
                </div>
            )}
        </div>
    );
};

export default AdminTimerOverview; 