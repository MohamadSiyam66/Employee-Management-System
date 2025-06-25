import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EmpTask = () => {
  const [empId, setEmpId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [rejectReasons, setRejectReasons] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setEmpId(userId);
    if (userId) {
      fetchTasks(userId);
    }
  }, []);

  const getTaskOwnerId = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    return task?.ownerId?.empId;
  };

  // fetch all tasks by employee ID
  const fetchTasks = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/task/employee/${id}`);
      setTasks(response.data);
      // console.log("Fetched tasks:", response.data);
    } catch (error) {
      console.error("Failed to fetch employee tasks:", error);
    }
    

  };
  // Accept task handling
  const handleAccept = async (taskId) => {
    try {
      await axios.put(`http://localhost:8080/api/task/update/${taskId}`, {
        acceptingStatus: "ACCEPTED",
        assignedToId: empId
      });
    
      const recipientId = getTaskOwnerId(taskId);

      await axios.post('http://localhost:8080/api/notifications/send', {
        recipientId,
        taskId,
        type: "ACCEPTED",
        message: `Task #${taskId} accepted by employee #${empId}`
      });
      Swal.fire("Accepted!", "Task has been accepted.", "success");
      fetchTasks(empId);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not accept the task", "error");
    }
  };

  // Reject task handling
  const handleReject = async (taskId) => {
    const reason = rejectReasons[taskId];
    if (!reason) {
      Swal.fire("Please enter a rejecting reason");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/task/update/${taskId}`, {
        acceptingStatus: "REJECTED",
        rejectingReason: reason,
        assignedToId: empId
      });

      const recipientId = getTaskOwnerId(taskId);

      await axios.post('http://localhost:8080/api/notifications/send', {
        recipientId,
        taskId,
        type: "REJECTED",
        message: `Task #${taskId} rejected by employee #${empId}`
      });

      Swal.fire("Rejected!", "Task has been rejected.", "warning");
      fetchTasks(empId);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not reject the task", "error");
    }
  };

  const handleReasonChange = (taskId, value) => {
    setRejectReasons(prev => ({ ...prev, [taskId]: value }));
  };
  // task status change handling
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/task/update/${taskId}`, {
        status: newStatus,
        assignedToId: empId
      });

      const recipientId = getTaskOwnerId(taskId);
      console.log(`Recipient ID: ${recipientId}, Task ID: ${taskId}, New Status: ${newStatus}`);
      

      await axios.post('http://localhost:8080/api/notifications/send', {
        recipientId,
        taskId,
        type: newStatus,
        message: `Task #${taskId} marked as ${newStatus} by employee #${empId}`
      });
      
      Swal.fire("Updated!", "Task status updated.", "success");
      fetchTasks(empId);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not update task status", "error");
    }
  };

  return (
  <div className=" bg-white shadow-md rounded-lg p-4">
    <h4 className="text-xl font-semibold text-gray-800 mb-4">My Assigned Tasks</h4>

    {/* Table view for md and above */}
    <div className="hidden md:block overflow-x-auto max-h-[500px]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-cyan-600 text-white sticky top-0 z-10">
          <tr>
            <th className="p-3 text-left text-sm font-semibold">Task Name</th>
            <th className="p-3 text-left text-sm font-semibold">Description</th>
            <th className="p-3 text-left text-sm font-semibold">Start Date</th>
            <th className="p-3 text-left text-sm font-semibold">Due Date</th>
            <th className="p-3 text-left text-sm font-semibold">Task Status</th>
            <th className="p-3 text-left text-sm font-semibold">Accepting Status</th>
            <th className="p-3 text-left text-sm font-semibold">Reason (if Rejecting)</th>
            <th className="p-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-100 transition border-b border-gray-200">
                <td className="p-3">{task.name}</td>
                <td className="p-3">{task.description}</td>
                <td className="p-3">{task.startDate}</td>
                <td className="p-3">{task.dueDate}</td>
                <td className="p-3">
                  <select
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </td>
                <td className="p-3">{task.acceptingStatus}</td>
                <td className="p-3">
                  {task.acceptingStatus === 'PENDING' ? (
                    <textarea
                      className="w-full border rounded p-1 text-sm"
                      rows={2}
                      placeholder="Enter reason..."
                      value={rejectReasons[task.id] || ''}
                      onChange={(e) => handleReasonChange(task.id, e.target.value)}
                    />
                  ) : task.acceptingStatus === 'REJECTED' ? (
                    <div className="text-sm text-red-700 italic">{task.rejectingReason || "No reason provided."}</div>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="p-3 space-y-1">
                  {task.acceptingStatus === 'PENDING' ? (
                    <div className="flex flex-col md:flex-row md:space-x-2">
                      <button
                        onClick={() => handleAccept(task.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mb-1 md:mb-0"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(task.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="italic text-gray-500">No actions</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                No tasks assigned.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* List view for mobile */}
    <div className="block md:hidden space-y-4">
      {tasks.length > 0 ? (
        tasks.map(task => (
          <div key={task.id} className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50">
            <p><span className="font-semibold">Task:</span> {task.name}</p>
            <p><span className="font-semibold">Description:</span> {task.description}</p>
            <p><span className="font-semibold">Start Date:</span> {task.startDate}</p>
            <p><span className="font-semibold">Due Date:</span> {task.dueDate}</p>
            <p><span className="font-semibold">Accepting Status:</span> {task.acceptingStatus}</p>
            <p><span className="font-semibold">Task Status:</span></p>
            <select
              className="w-full border rounded px-2 py-1 text-sm mb-2"
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>

            {task.acceptingStatus === 'REJECTED' && (
              <p className="text-red-700 text-sm italic">
                <span className="font-semibold">Rejection Reason:</span> {task.rejectingReason || 'No reason provided'}
              </p>
            )}

            {task.acceptingStatus === 'PENDING' && (
              <>
                <textarea
                  className="w-full border rounded p-1 text-sm mb-2"
                  rows={2}
                  placeholder="Enter rejection reason..."
                  value={rejectReasons[task.id] || ''}
                  onChange={(e) => handleReasonChange(task.id, e.target.value)}
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => handleAccept(task.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(task.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No tasks assigned.</p>
      )}
    </div>
  </div>
);
}

export default EmpTask;
