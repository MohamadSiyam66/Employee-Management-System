import { BarChart3 } from 'lucide-react';

const ReportControls = ({ 
    selectedReport, 
    onReportTypeChange, 
    dateRange, 
    onDateRangeChange, 
    selectedDate, 
    onDateChange, 
    onGenerateReport, 
    loading, 
    reportTypes, 
    dateRanges, 
    showDateFilter = true,
    onResetFilters
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Report Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report Type
                    </label>
                    <select
                        value={selectedReport}
                        onChange={(e) => onReportTypeChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        {reportTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Range Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range {selectedDate && <span className="text-xs text-gray-500">(disabled when specific date selected)</span>}
                    </label>
                    <select
                        value={dateRange}
                        onChange={(e) => onDateRangeChange(e.target.value)}
                        disabled={!!selectedDate}
                        className={`w-full p-2 border border-gray-300 rounded-md ${selectedDate ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                        {dateRanges.map((range) => (
                            <option key={range.id} value={range.id}>
                                {range.id === 'today' ? 'All Data' : range.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Filter for All Reports */}
                {showDateFilter && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Date {dateRange !== 'today' && <span className="text-xs text-gray-500">(clears date range)</span>}
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => onDateChange(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                )}

                {/* Generate Button */}
                <div className="flex items-end gap-2">
                    <button
                        onClick={onGenerateReport}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <BarChart3 size={20} />
                        {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                    {(selectedDate || dateRange !== 'today') && (
                        <button
                            onClick={onResetFilters}
                            className="bg-gray-500 text-white py-2 px-3 rounded-md hover:bg-gray-600 text-sm"
                            title="Reset all filters"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>
            
            {/* Active Filter Indicator */}
            {(selectedDate || dateRange !== 'today') && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                        <strong>Active Filter:</strong> 
                        {selectedDate ? ` Specific date: ${selectedDate}` : ` Date range: ${dateRanges.find(r => r.id === dateRange)?.name}`}
                    </p>
                </div>
            )}
            
            {/* All Data Indicator */}
            {!selectedDate && dateRange === 'today' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                        <strong>Showing:</strong> All available data
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReportControls; 