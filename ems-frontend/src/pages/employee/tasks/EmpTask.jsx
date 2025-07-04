import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import EmployeeTeams from '../../../components/team/EmployeeTeams';
import AssignedTasksTable from '../../../components/task/AssignedTasksTable';
import { Briefcase, Users } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Briefcase size={24} />My Tasks</h1>
          <p className="text-gray-600">View and manage your assigned tasks.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      {/* Team Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Users size={22} className="text-blue-600" />
          <span className="font-bold text-blue-700">My Teams</span>
        </div>
        <EmployeeTeams empId={empId} />
      </div>
      {/* Assigned Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase size={22} className="text-green-600" />
          <span className="font-bold text-green-700">Assigned Tasks</span>
        </div>
        <AssignedTasksTable
          tasks={tasks}
          empId={empId}
          rejectReasons={rejectReasons}
          handleStatusChange={handleStatusChange}
          handleReasonChange={handleReasonChange}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
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
