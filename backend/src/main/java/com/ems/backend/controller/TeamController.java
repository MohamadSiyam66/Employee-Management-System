package com.ems.backend.controller;

import com.ems.backend.dto.TeamDTO;
import com.ems.backend.entity.Task;
import com.ems.backend.entity.Team;
import com.ems.backend.service.TaskService;
import com.ems.backend.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final TaskService taskService;

    @PostMapping("/create")
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        return ResponseEntity.ok(teamService.createTeam(team));
    }

    @GetMapping("/teams")
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Integer id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @PutMapping("/{taskId}/assign-team/{teamId}")
    public ResponseEntity<Task> assignTeamToTask(@PathVariable Long taskId, @PathVariable Integer teamId) {
        return ResponseEntity.ok(taskService.assignTeamToTask(taskId, teamId));
    }

    @GetMapping("/team-dto")
    public ResponseEntity<List<TeamDTO>> getTeamDTOs() {
        return ResponseEntity.ok(teamService.getAllTeamsWithTasks());
    }

    @GetMapping("/employee/{empId}")
    public ResponseEntity<TeamDTO> getTeamByEmployeeId(@PathVariable Long empId) {
        return ResponseEntity.ok(teamService.getTeamByEmployeeId(empId));
    }

    @GetMapping("/employee/{employeeId}/teams")
    public ResponseEntity<List<TeamDTO>> getTeamsByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(teamService.getTeamsByEmployeeId(employeeId));
    }

}
