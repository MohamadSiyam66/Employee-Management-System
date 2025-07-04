import { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeTeams = ({ empId }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empId) {
      fetchEmployeeTeams(empId);
    }
  }, [empId]);

  const fetchEmployeeTeams = async (employeeId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/team/employee/${employeeId}/teams`);
      setTeams(response.data);
    } catch (error) {
      console.error("Failed to fetch employee teams:", error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading teams...</div>;
  }

  if (teams.length === 0) {
    return <div className="text-gray-500">You are not part of any teams.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {teams.map((team) => (
        <div key={team.id} className="border border-blue-200 shadow-md rounded-xl p-4 bg-white hover:shadow-lg transition">
          <h5 className="font-bold text-blue-800 text-lg mb-1">{team.name}</h5>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">Team Lead:</span> {team.teamLead || 'Not assigned'}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">Members:</span> {team.members.length}
          </p>
          {team.assignedTasks && team.assignedTasks.length > 0 && (
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Assigned Tasks:</span> {team.assignedTasks.length}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmployeeTeams;