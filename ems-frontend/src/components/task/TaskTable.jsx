import React from 'react';
import { Briefcase } from 'lucide-react';

const TaskTable = ({ tasks, markTaskCompleted }) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-2"><Briefcase size={26} className="text-green-600" /><span className="font-bold text-2xl text-green-700">All Tasks</span></div>
      <div className="overflow-x-auto overflow-y-auto max-h-[500px] max-md:max-w-[300px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${task.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.assignedToId
                    ? `${task.assignedToId.fname} ${task.assignedToId.lname}`
                    : 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => markTaskCompleted(task.id)}
                    disabled={task.status === 'COMPLETED'}
                    className={`px-3 py-1 rounded-md text-sm font-medium 
                      ${task.status === 'COMPLETED'
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    Mark Completed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TaskTable;
