
const PerformanceSummary = ({ summary }) => {
    if (!summary) return null;
    return (
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Performance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                    <div className="font-bold">Attendance</div>
                    <div>Total Days: {summary.totalAttendanceDays}</div>
                    <div>Present: {summary.presentDays}</div>
                    <div>Absent: {summary.absentDays}</div>
                    <div>Avg. Hours: {summary.avgAttendanceHours}</div>
                </div>
                <div className="bg-green-50 p-4 rounded">
                    <div className="font-bold">Leaves</div>
                    <div>Total: {summary.totalLeaves}</div>
                    <div>Approved: {summary.approvedLeaves}</div>
                    <div>Pending: {summary.pendingLeaves}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded">
                    <div className="font-bold">Timesheets</div>
                    <div>Total Entries: {summary.totalTimesheets}</div>
                    <div>Avg. Work Hours: {summary.avgTimesheetHours}</div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceSummary; 