import React from 'react';
import { Calendar } from 'lucide-react';

const GlobalDateFilter = ({ value, onChange }) => {
    const dateOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'year', label: 'This Year' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
                <Calendar size={20} className="text-blue-600" />
                <label className="text-sm font-medium text-gray-700">Global Date Filter:</label>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {dateOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className="text-xs text-gray-500">
                    Applied to all report sections
                </span>
            </div>
        </div>
    );
};

export default GlobalDateFilter; 