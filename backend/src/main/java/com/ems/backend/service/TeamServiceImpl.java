package com.ems.backend.service;

import com.ems.backend.dto.TeamDTO;
import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Notification;
import com.ems.backend.entity.Task;
import com.ems.backend.entity.Team;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.repository.NotificationRepository;
import com.ems.backend.repository.TaskRepository;
import com.ems.backend.repository.TeamRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationRepository notificationRepository;
    private final TaskRepository taskRepository;

    @Override
    public Team createTeam(Team team) {
        Team savedTeam = teamRepository.save(team);

        // Notify each member
        for (Employee member : team.getMembers()) {
            Notification notification = new Notification();
            notification.setMessage("You have been assigned to team: " + team.getName());
            notification.setRecipientId(member);
            notification.setType(Notification.Type.ASSIGNED);
            notificationRepository.save(notification);
        }

        return savedTeam;
    }

    @Override
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Override
    public Team getTeamById(Integer id) {
        return teamRepository.findById(Long.valueOf(id)).orElseThrow(() -> new RuntimeException("Team not found"));
    }

    @Override
    public List<TeamDTO> getAllTeamsWithTasks() {
        List<Team> teams = teamRepository.findAll();
        List<Task> tasks = taskRepository.findAll();

        return teams.stream().map(team -> {
            TeamDTO dto = new TeamDTO();
            dto.setId(team.getId());
            dto.setName(team.getName());

            // Set team leader full name
            if (team.getTeamLead() != null) {
                dto.setTeamLead(team.getTeamLead().getFname() + " " + team.getTeamLead().getLname());
            }

            // Set team members
            dto.setMembers(team.getMembers().stream()
                    .map(emp -> emp.getFname() + " " + emp.getLname())
                    .toList());

            // Set assigned tasks (match by team ID)
            dto.setAssignedTasks(tasks.stream()
                    .filter(task -> task.getTeam() != null && task.getTeam().getId().equals(team.getId()))
                    .map(Task::getName)
                    .toList());
            return dto;
        }).toList();
    }

    @Override
    public TeamDTO getTeamByEmployeeId(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<Team> teams = teamRepository.findByMembersContaining(employee);

        if (teams.isEmpty()) {
            return null;
        }

        // Just get the first team (or implement logic to choose the right one)
        Team team = teams.get(0);

        TeamDTO dto1 = new TeamDTO();
        dto1.setId(team.getId());
        dto1.setName(team.getName());

        // Set team leader full name
        if (team.getTeamLead() != null) {
            dto1.setTeamLead(team.getTeamLead().getFname() + " " + team.getTeamLead().getLname());
        }

        // Set team members
        dto1.setMembers(team.getMembers().stream()
                .map(emp -> emp.getFname() + " " + emp.getLname())
                .toList());

        return dto1;
    }

    @Override
    public List<TeamDTO> getTeamsByEmployeeId(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<Team> teams = teamRepository.findByMembersContaining(employee);

        return teams.stream().map(team -> {
            TeamDTO dto = new TeamDTO();
            dto.setId(team.getId());
            dto.setName(team.getName());

            if (team.getTeamLead() != null) {
                dto.setTeamLead(team.getTeamLead().getFname() + " " + team.getTeamLead().getLname());
            }

            dto.setMembers(team.getMembers().stream()
                    .map(emp -> emp.getFname() + " " + emp.getLname())
                    .toList());

            // Get assigned tasks for this team
            List<Task> teamTasks = taskRepository.findByTeam_Id(team.getId());
            dto.setAssignedTasks(teamTasks.stream()
                    .map(Task::getName)
                    .toList());

            return dto;
        }).toList();
    }
}
