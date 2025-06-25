const TaskList = ({ title, tasks }) => (
  <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    {tasks.length > 0 ? (
      <ul className="list-disc ml-6 space-y-1">
        {tasks.map(task => (
          <li key={task.id}>{task.name} — <span className="text-sm italic text-gray-500">{task.status}</span></li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No tasks found.</p>
    )}
  </div>
);

export default TaskList;