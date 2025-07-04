import { useState, useEffect } from 'react';
import { ClipboardList, UserPlus, Briefcase, Users } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import BASE_URL from '../../../api';

import TaskList from '../../../components/TaskList';
import CreateTeam from '../../../components/task/CreateTeam';
import TaskTable from '../../../components/task/TaskTable';
import AssignTaskForm from './../../../components/task/AssignTaskForm ';
import CreateTaskForm from '../../../components/task/CreateTaskForm';
import TeamTaskTable from '../../../components/task/TeamTaskTable';

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
    const [teams, setTeams] = useState([]);


    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        setOwnerName(storedName || '');

        axios.get(`${BASE_URL}/api/task/tasks`)
            .then(res => setTasks(res.data))
            .catch(err => console.error('Error fetching tasks:', err));

        // axios.get('http://localhost:8080/api/team/teams')
        //     .then(res => setTeams(res.data))
        //     .catch(err => console.error('Error fetching teams:', err));

        axios.get(`${BASE_URL}/api/team/team-dto`)
            .then(res => setTeams(res.data))
            .catch(err => console.error('Error fetching teams:', err));
        console.log(teams);

        axios.get(`${BASE_URL}/api/employee/employees`)
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
    // Create task function
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
            await axios.post(`${BASE_URL}/api/task/add`, payload);
            Swal.fire({
                icon: 'success',
                title: 'Task Created',
                text: 'The task was successfully created!',
                timer: 2000,
                showConfirmButton: false
            });

        // fetch updated tasks after creation
            const response1 = await axios.get(`${BASE_URL}/api/task/tasks`);
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

            const response = await axios.get(`${BASE_URL}/api/task/tasks`);
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
        await axios.put(`${BASE_URL}/api/task/update/${assignedTask.taskId}`, {
            assignedToId: assignedTask.employeeId
        });

        // send notification
        await axios.post(`${BASE_URL}/api/notifications/send`, {
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
        const updatedTasks = await axios.get(`${BASE_URL}/api/task/tasks`);
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

    // update task completed
    const markTaskCompleted = async (taskId) => {
        try {
            await axios.put(`${BASE_URL}/api/task/update/${taskId}`, {
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
            const updatedTasks = await axios.get(`${BASE_URL}/api/task/tasks`);
            setTasks(updatedTasks.data);
        } catch (error) {
            console.error('Error updating task:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'There was an error updating the task status, ' + error.message,
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ClipboardList size={24} />Task Management</h1>
                    <p className="text-gray-600">Create, assign, and manage all tasks and teams.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Today</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-wrap gap-4 justify-center mb-4">
                <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary flex items-center gap-2"><Briefcase size={18} />{showCreateForm ? 'Hide' : 'Create Task'}</button>
                <button onClick={() => setShowAssignForm(!showAssignForm)} className="btn-secondary flex items-center gap-2"><UserPlus size={18} />{showAssignForm ? 'Hide' : 'Assign Task'}</button>
                <button onClick={() => setShowTotalTasks(!showTotalTasks)} className="btn-gray">{showTotalTasks ? 'Hide' : 'All Tasks'}</button>
                <button onClick={() => setShowCompletedTasks(!showCompletedTasks)} className="btn-green">{showCompletedTasks ? 'Hide' : 'Completed Tasks'}</button>
                <button onClick={() => setShowPendingTasks(!showPendingTasks)} className="btn-yellow">{showPendingTasks ? 'Hide' : 'Pending Tasks'}</button>
            </div>
            {/* Forms */}
            {showCreateForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                    <CreateTaskForm
                        taskForm={taskForm}
                        handleTaskChange={handleTaskChange}
                        createTask={createTask}
                        ownerName={ownerName}
                    />
                </div>
            )}
            {showAssignForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                    <AssignTaskForm
                        assignedTask={assignedTask}
                        handleAssignChange={handleAssignChange}
                        assignTask={assignTask}
                        tasks={tasks}
                        employees={employees}
                    />
                </div>
            )}
            {/* Task Lists */}
            {showTotalTasks && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                    <TaskList title="All Tasks" tasks={tasks} />
                </div>
            )}
            {showCompletedTasks && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                    <TaskList title="Completed Tasks" tasks={tasks.filter(t => t.status === 'COMPLETED')} />
                </div>
            )}
            {showPendingTasks && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                    <TaskList title="Pending Tasks" tasks={tasks.filter(t => t.status === 'PENDING')} />
                </div>
            )}
            {/* Create and Assign Teams Row */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    
                    <CreateTeam tasks={tasks} setTasks={setTasks} />
                </div>
            </div>
            {/* All Tasks Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <TaskTable tasks={tasks} markTaskCompleted={markTaskCompleted} />
            </div>
            {/* Team Task Details Table (now only below All Tasks Table) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <TeamTaskTable teams={teams} />
            </div>
        </div>
    );
};

export default TaskPage;