// components/task/CreateTaskForm.jsx
import { ClipboardList } from 'lucide-react';

const CreateTaskForm = ({ taskForm, handleTaskChange, createTask, ownerName }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center mb-6 gap-2">
        <ClipboardList className="text-blue-600" />
        <h2 className="text-2xl font-semibold">Create a Task</h2>
      </div>
      <form onSubmit={createTask} className="grid gap-6 grid-cols-1 md:grid-cols-2">
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
  );
};

export default CreateTaskForm;
