const AssignedTasksTable = ({
    tasks, empId, rejectReasons, handleStatusChange, handleReasonChange, handleAccept, handleReject,
}) => {
    return (
        <>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">My Assigned Tasks</h4>
            <div className="hidden md:block overflow-x-auto max-h-[500px]">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-cyan-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Task Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Description</th>
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Start Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Due Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Task Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Acceptance</th>
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Rejection Reason</th>
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{task.name}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{task.description}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{task.startDate}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{task.dueDate}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <select
                                            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                                            <option value="COMPLETED">COMPLETED</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            task.acceptingStatus === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                            task.acceptingStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {task.acceptingStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {task.acceptingStatus === 'PENDING' ? (
                                            <textarea
                                                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                                rows={2}
                                                placeholder="Enter reason..."
                                                value={rejectReasons[task.id] || ''}
                                                onChange={(e) => handleReasonChange(task.id, e.target.value)}
                                            />
                                        ) : task.acceptingStatus === 'REJECTED' ? (
                                            <div className="text-sm text-red-600 italic">{task.rejectingReason || "No reason provided."}</div>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {task.acceptingStatus === 'PENDING' ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleAccept(task.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleReject(task.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 italic text-sm">No actions</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                                    No tasks assigned.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AssignedTasksTable;