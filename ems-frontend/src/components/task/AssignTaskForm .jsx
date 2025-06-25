import { UserPlus } from 'lucide-react';

const AssignTaskForm = ({
    assignedTask,
    handleAssignChange,
    assignTask,
    tasks,
    employees }) => {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center mb-6 gap-2">
            <UserPlus className="text-green-600" />
            <h2 className="text-2xl font-semibold">Assign Task to Employee</h2>
        </div>
        <form onSubmit={assignTask} className="grid gap-6 md:grid-cols-2">
            <div>
            <label className="block text-sm font-medium mb-1">Select Task</label>
            <select
                name="taskId"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={assignedTask.taskId}
                onChange={handleAssignChange}
                required
            >
                <option value="">-- Select Task --</option>
                {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                    {task.name}
                </option>
                ))}
            </select>
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Select Employee</label>
            <select
                name="employeeId"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={assignedTask.employeeId}
                onChange={handleAssignChange}
                required
            >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                <option key={emp.empId} value={emp.empId}>
                    {emp.fname} {emp.lname}
                </option>
                ))}
            </select>
            </div>

            <div className="col-span-1 md:col-span-2">
            <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 transition-all text-white font-semibold py-2 px-4 rounded-lg"
            >
                Assign Task
            </button>
            </div>
        </form>
        </div>
    );
    };

    export default AssignTaskForm;