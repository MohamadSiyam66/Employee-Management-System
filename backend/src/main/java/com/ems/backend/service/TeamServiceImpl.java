package com.ems.backend.service;

import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Notification;
import com.ems.backend.entity.Team;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.repository.NotificationRepository;
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
}
