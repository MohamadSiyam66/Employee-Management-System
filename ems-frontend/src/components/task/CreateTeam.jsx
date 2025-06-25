// CreateTeamComponent.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreateTeam = ({ tasks, setTasks }) => {
  const [teamForm, setTeamForm] = useState({
    name: '',
    teamLeadId: '',
    memberIds: []
  });

  const [assignForm, setAssignForm] = useState({
    taskId: '',
    teamId: ''
  });

  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/employee/employees')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Error fetching employees:', err));

    axios.get('http://localhost:8080/api/team/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error('Error fetching teams:', err));
  }, []);

  const handleTeamChange = (e) => {
    setTeamForm({ ...teamForm, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setTeamForm({ ...teamForm, memberIds: value });
  };

  const handleAssignChange = (e) => {
    setAssignForm({ ...assignForm, [e.target.name]: e.target.value });
  };

  const createTeam = async (e) => {
    e.preventDefault();
    try {
      const teamPayload = {
        name: teamForm.name,
        teamLead: { empId: teamForm.teamLeadId },
        members: teamForm.memberIds.map(id => ({ empId: id }))
      };

      await axios.post('http://localhost:8080/api/teams/create', teamPayload);

      Swal.fire({
        icon: 'success',
        title: 'Team Created',
        timer: 2000,
        showConfirmButton: false
      });

      setTeamForm({ name: '', teamLeadId: '', memberIds: [] });

      const res = await axios.get('http://localhost:8080/api/team/teams');
      setTeams(res.data);
    } catch (error) {
      console.error('Error creating team:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Team creation failed.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const assignTaskToTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/team/${assignForm.taskId}/assign-team/${assignForm.teamId}`);

      // Get the team lead ID from the selected team
      const selectedTeam = teams.find(team => team.id === parseInt(assignForm.teamId));
      const teamLeadId = selectedTeam?.teamLead?.empId;

      await axios.post('http://localhost:8080/api/notifications/send', {
        recipientId: teamLeadId,
        taskId: assignForm.taskId,
        type: 'ASSIGNED',
        message: `Task ${assignForm.taskId} assigned to team ${assignForm.teamId}`
      });

      Swal.fire({
        icon: 'success',
        title: 'Task Assigned to Team',
        timer: 2000,
        showConfirmButton: false
      });

      const updatedTasks = await axios.get('http://localhost:8080/api/task/tasks');
      setTasks(updatedTasks.data);

      setAssignForm({ taskId: '', teamId: '' });
    } catch (error) {
      console.error('Error assigning task to team:', error);
      Swal.fire({
        icon: 'error',
        title: 'Assignment Failed',
        text: 'Failed to assign task to team.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="space-y-8 flex flex-row flex-wrap justify-center items-start gap-10">
      {/* Create Team */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Create a Team</h2>
        <form onSubmit={createTeam} className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Team Name</label>
            <input type="text" name="name" value={teamForm.name} onChange={handleTeamChange} required className="w-full border border-gray-300 rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Team Lead</label>
            <select name="teamLeadId" value={teamForm.teamLeadId} onChange={handleTeamChange} required className="w-full border border-gray-300 rounded-lg p-2">
              <option value=''>-- Select Team Lead --</option>
              {employees.map(emp => (
                <option key={emp.empId} value={emp.empId}>{emp.fname} {emp.lname}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Team Members (multi-select)</label>
            <select multiple name="memberIds" value={teamForm.memberIds} onChange={handleMemberChange} className="w-full border border-gray-300 rounded-lg p-2">
              {employees.map(emp => (
                <option key={emp.empId} value={emp.empId}>{emp.fname} {emp.lname}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold">
              Create Team
            </button>
          </div>
        </form>
      </div>

      {/* Assign Task to Team */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Assign Task to a Team</h2>
        <form onSubmit={assignTaskToTeam} className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Select Task</label>
            <select name="taskId" value={assignForm.taskId} onChange={handleAssignChange} required className="w-full border border-gray-300 rounded-lg p-2">
              <option value=''>-- Select Task --</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>{task.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Team</label>
            <select name="teamId" value={assignForm.teamId} onChange={handleAssignChange} required className="w-full border border-gray-300 rounded-lg p-2">
              <option value=''>-- Select Team --</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-semibold">
              Assign Task to Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
