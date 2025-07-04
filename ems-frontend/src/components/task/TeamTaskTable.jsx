import { Users}  from 'lucide-react';
const TeamTaskTable = ({ teams }) => {
  return (
    <div className="overflow-x-auto ">
       <div className="flex items-center gap-3 mb-2"><Users size={26} className="text-purple-600" /><span className="font-bold text-2xl text-purple-700">Team Task Details</span></div>
      <table className="min-w-full text-sm border-collapse ">
        <thead>
          <tr className="bg-cyan-600 text-white">
            <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-cyan-700">Team ID</th>
            <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-cyan-700">Team Name</th>
            <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-cyan-700">Team Leader</th>
            <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-cyan-700">Members</th>
            <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-cyan-700">Assigned Tasks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {teams.map((team) => (
            <tr key={team.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-900">
                {team.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-cyan-600">
                {team.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {team.teamLead || 'Unassigned'}
                </span>
              </td>
              <td className="px-6 py-4">
                {team.members.length > 0 ? (
                  <ul className="space-y-1">
                    {team.members.map((member, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>{member}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400 italic">No members</span>
                )}
              </td>
              <td className="px-6 py-4">
                {team.assignedTasks?.length > 0 ? (
                  <ul className="space-y-1">
                    {team.assignedTasks.map((taskName, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-4 w-4 text-amber-500 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        </svg>
                        <span>{taskName}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400 italic">No tasks</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {teams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No teams available
        </div>
      )}
    </div>
  );
};

export default TeamTaskTable;