package com.ems.backend.controller;

import com.ems.backend.dto.TaskRequestDTO;
import com.ems.backend.dto.TaskUpdateDTO;
import com.ems.backend.dto.TeamLeadTaskDecisionDTO;
import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Task;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("api/task")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TaskController {

    private final TaskService taskService;
    private final EmployeeRepository employeeRepository;
    // create employee
    @PostMapping("/add") //ok
    public ResponseEntity<Task> create(@RequestBody TaskRequestDTO dto) {
        Task task = new Task();
        task.setName(dto.getName());
        task.setDescription(dto.getDescription());
        task.setStartDate(dto.getStartDate());
        task.setDueDate(dto.getDueDate());
        task.setReminderDate(dto.getReminderDate());
        task.setRejectingReason(dto.getRejectingReason());
        task.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        task.setStatus(Task.Status.valueOf(dto.getStatus()));
        task.setPriority(Task.Priority.valueOf(dto.getPriority()));
        task.setAcceptingStatus(Task.AcceptingStatus.valueOf(dto.getAcceptingStatus()));

        // Fetch Employee entity from DB
        Employee owner = employeeRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner employee not found"));
        task.setOwnerId(owner);

        return ResponseEntity.ok(taskService.createTask(task));
    }

    // getting all tasks
    @GetMapping("/tasks")  // ok
    public ResponseEntity<List<Task>> getAll() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Task> updateTaskGeneral(@PathVariable Long id, @RequestBody TaskUpdateDTO dto) {
        return ResponseEntity.ok(taskService.updateTask(id, dto));
    }

    // get tasks by employee
    @GetMapping("/employee/{empId}")
    public ResponseEntity<List<Task>> getEmployeeTasks(@PathVariable Long empId) {
        return ResponseEntity.ok(taskService.getTasksByEmployee(empId));
    }

    @PutMapping("/team-lead-task/{taskId}")
    public ResponseEntity<String> teamLeadRespondToTask( @PathVariable Long taskId, @RequestBody TeamLeadTaskDecisionDTO dto) {
        try {
            taskService.teamLeadRespondToTask(taskId, dto.getDecision(), dto.getReason());
            return ResponseEntity.ok("Task has been " + dto.getDecision().toLowerCase() + "ed by the team lead.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
