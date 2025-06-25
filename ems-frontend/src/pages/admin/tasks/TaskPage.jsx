import { useState, useEffect } from 'react';
import { ClipboardList, UserPlus } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import TaskList from '../../../components/TaskList';
import CreateTeam from '../../../components/task/CreateTeam';
import TaskTable from '../../../components/task/TaskTable';
import AssignTaskForm from './../../../components/task/AssignTaskForm ';


const TaskPage = () => {
    const [taskForm, setTaskForm] = useState({
        owner: '',
        name: '',
        desc: '',
        startDate: '',
        dueDate: '',
        status: 'PENDING',
        priority: 'LOW',
        reminder: '',
        acceptingStatus: 'PENDING',
        rejectingReason: '',
    });

  const [assignedTask, setAssignedTask] = useState({
    taskId: '',
    employeeId: '',
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showTotalTasks, setShowTotalTasks] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showPendingTasks, setShowPendingTasks] = useState(false);

    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [ownerName, setOwnerName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        setOwnerName(storedName || '');

        axios.get('http://localhost:8080/api/task/tasks')
            .then(res => setTasks(res.data))
            .catch(err => console.error('Error fetching tasks:', err));

        axios.get('http://localhost:8080/api/employee/employees')
            .then(res => {
                setEmployees(res.data);
                // Match name from localStorage with employee full name
                const matchedEmployee = res.data.find(emp =>
                    `${emp.username}`.toLowerCase() === storedName.toLowerCase()
                );
                if (matchedEmployee) {
                    setTaskForm(prev => ({ ...prev, owner: matchedEmployee.empId }));
                }
            })
            .catch(err => console.error('Error fetching employees:', err));
    }, []);


    const handleTaskChange = (e) => {
        setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
    };

    const handleAssignChange = (e) => {
        setAssignedTask({ ...assignedTask, [e.target.name]: e.target.value });
    };
    const createTask = async (e) => {
    e.preventDefault();
    try {
        const payload = {
        name: taskForm.name,
        description: taskForm.desc,
        startDate: taskForm.startDate,
        dueDate: taskForm.dueDate,
        reminderDate: taskForm.reminder,
        status: taskForm.status,
        priority: taskForm.priority,
        acceptingStatus: taskForm.acceptingStatus,
        rejectingReason: taskForm.rejectingReason,
        ownerId: taskForm.owner
        };
        await axios.post('http://localhost:8080/api/task/add', payload);
        Swal.fire({
            icon: 'success',
            title: 'Task Created',
            text: 'The task was successfully created!',
            timer: 2000,
            showConfirmButton: false
        });
        // fetch updated tasks after creation
        const response1 = await axios.get('http://localhost:8080/api/task/tasks');
        setTasks(response1.data);

        setTaskForm({
        owner: taskForm.owner,
        name: '',
        desc: '',
        startDate: '',
        dueDate: '',
        status: 'PENDING',
        priority: 'LOW',
        reminder: '',
        acceptingStatus: 'PENDING',
        rejectingReason: '',
        });

        const response = await axios.get('http://localhost:8080/api/task/tasks');
        setTasks(response.data);
    } catch (error) {
        console.error('Error creating task:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error creating the task.',
            timer: 2000,
            showConfirmButton: false
        });
    }
    };

    const assignTask = async (e) => {
    e.preventDefault();
    try {
        await axios.put(`http://localhost:8080/api/task/update/${assignedTask.taskId}`, {
            assignedToId: assignedTask.employeeId
        });

        // send notification
        await axios.post("http://localhost:8080/api/notifications/send", {
            recipientId: assignedTask.employeeId,
            taskId: assignedTask.taskId,
            type: "ASSIGNED",
            message: `${ownerName} has assigned you a new task: ${assignedTask.taskId}.`
        });

        Swal.fire({
        icon: 'success',
        title: 'Task Assigned',
        text: 'The task was successfully assigned!',
        timer: 2000,
        showConfirmButton: false
        });

        // Refresh task list
        const updatedTasks = await axios.get('http://localhost:8080/api/task/tasks');
        setTasks(updatedTasks.data);

        // Reset assign form
        setAssignedTask({
        taskId: '',
        employeeId: '',
        });

    } catch (error) {
        console.error('Error assigning task:', error);
        Swal.fire({
        icon: 'error',
        title: 'Assignment Failed',
        text: 'There was an error assigning the task.',
        timer: 2000,
        showConfirmButton: false
        });
    }
    };

    const markTaskCompleted = async (taskId) => {
  try {
    await axios.put(`http://localhost:8080/api/task/update/${taskId}`, {
      status: 'COMPLETED'
    });

    Swal.fire({
      icon: 'success',
      title: 'Task Completed',
      text: 'The task status has been updated to COMPLETED',
      timer: 2000,
      showConfirmButton: false
    });

    // Refresh task list
    const updatedTasks = await axios.get('http://localhost:8080/api/task/tasks');
    setTasks(updatedTasks.data);
  } catch (error) {
    console.error('Error updating task:', error);
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: 'There was an error updating the task status',
      timer: 2000,
      showConfirmButton: false
    });
  }
};

    return (
    <div className="h-fit overflow-y-auto overflow-x-hidden p-6 bg-gray-50 space-y-8 md:max-w-6xl">
      {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-gray-50 py-4 flex flex-wrap gap-2 justify-center">
          <div>
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
                {showCreateForm ? 'Hide' : 'Create Task'}
            </button>
          </div>
            <div>
            <button onClick={() => setShowAssignForm(!showAssignForm)} className="btn-secondary">
                {showAssignForm ? 'Hide' : 'Assign Task'}
            </button>
             {/* Assign Task Form */}
            {showAssignForm && (
              <AssignTaskForm
                assignedTask={assignedTask}
                handleAssignChange={handleAssignChange}
                assignTask={assignTask}
                tasks={tasks}
                employees={employees}
              />
            )}</div>
            <div>
            <button onClick={() => setShowTotalTasks(!showTotalTasks)} className="btn-gray">
                {showTotalTasks ? 'Hide' : 'All Tasks'}
            </button>
            {showTotalTasks && (
                <TaskList title="All Tasks" tasks={tasks} />
            )}
            </div>
            <div>
            <button onClick={() => setShowCompletedTasks(!showCompletedTasks)} className="btn-green">
                {showCompletedTasks ? 'Hide' : 'Completed Tasks'}
            </button>
            {showCompletedTasks && (
                <TaskList title="Completed Tasks" tasks={tasks.filter(t => t.status === 'COMPLETED')} />
            )}
            </div>
            <div>
            <button onClick={() => setShowPendingTasks(!showPendingTasks)} className="btn-yellow">
                {showPendingTasks ? 'Hide' : 'Pending Tasks'}
            </button>
            {showPendingTasks && (
                <TaskList title="Pending Tasks" tasks={tasks.filter(t => t.status === 'PENDING')} />
            )}
            </div>
        </div>
        <CreateTeam tasks={tasks} setTasks={setTasks} />
          <div className="overflow-x-auto overflow-y-auto max-h-[500px] max-md:max-w-[300px]">
            <TaskTable tasks={tasks} markTaskCompleted={markTaskCompleted} />
          </div>
      {/* Create Task Form */}
        {showCreateForm && (
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center mb-6 gap-2">
            <ClipboardList className="text-blue-600" />
            <h2 className="text-2xl font-semibold">Create a Task</h2>
            </div>
            <form onSubmit={createTask} className="grid gap-6 grid-cols-1 md:grid-cols-2">
            
            {/* Task Creator - Owner (read-only or hidden input if just for ID) */}
            <div>
                <label className="block text-sm font-medium mb-1">Task Creator</label>
                <input
                  type="text"
                  name="owner"
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-700"
                  value={ownerName}
                  readOnly
                />
            </div>

            {/* Task Name */}
            <div>
                <label className="block text-sm font-medium mb-1">Task Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={taskForm.name}
                  onChange={handleTaskChange}
                  required
                />
            </div>

            {/* Start Date */}
            <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={taskForm.startDate}
                  onChange={handleTaskChange}
                  required
                />
            </div>

            {/* Due Date */}
            <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                type="date"
                name="dueDate"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskForm.dueDate}
                onChange={handleTaskChange}
                required
                />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                name="desc"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={taskForm.desc}
                onChange={handleTaskChange}
                />
            </div>

            {/* Priority */}
            <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                name="priority"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskForm.priority}
                onChange={handleTaskChange}
                >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                </select>
            </div>

            {/* Reminder */}
            <div>
                <label className="block text-sm font-medium mb-1">Reminder</label>
                <input
                type="datetime-local"
                name="reminder"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskForm.reminder}
                onChange={handleTaskChange}
                />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2">
                <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-2 px-4 rounded-lg"
                >
                Create Task
                </button>
            </div>
            </form>
        </div>
        )}
</div>
);
};

export default TaskPage;