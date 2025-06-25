package com.ems.backend.service;

import com.ems.backend.dto.TaskUpdateDTO;
import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Notification;
import com.ems.backend.entity.Task;
import com.ems.backend.entity.Team;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.repository.NotificationRepository;
import com.ems.backend.repository.TaskRepository;
import com.ems.backend.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final ReminderService reminderService;
    private final TeamRepository teamRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public Task createTask(Task task) {
        Task savedTask = taskRepository.save(task);
        if (task.getReminderDate() != null && task.getReminderDate().equals(LocalDate.now())) {
            reminderService.sendReminderNotification(savedTask);
        }
        return savedTask;
    }

    @Override
    public Task updateTask(Long id, TaskUpdateDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (dto.getAcceptingStatus() != null) {
            task.setAcceptingStatus(Task.AcceptingStatus.valueOf(dto.getAcceptingStatus().toUpperCase()));

            if (dto.getAcceptingStatus().equalsIgnoreCase("REJECTED") && dto.getRejectingReason() != null) {
                task.setRejectingReason(dto.getRejectingReason());
            }
        }

        if (dto.getAssignedToId() != null) {
            Employee employee = employeeRepository.findById(dto.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned employee not found"));
            task.setAssignedToId(employee);
        }

        if (dto.getStatus() != null) {
            task.setStatus(Task.Status.valueOf(dto.getStatus().toUpperCase()));
        }

        return taskRepository.save(task);
    }

    @Override
    public List<Task> getTasksByEmployee(Long empId) {
        return taskRepository.findByAssignedToId_EmpId(empId);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task assignTeamToTask(Long taskId, Integer teamId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        Team team = teamRepository.findById(Long.valueOf(teamId))
                .orElseThrow(() -> new RuntimeException("Team not found"));

        task.setTeam(team);

        for (Employee member : team.getMembers()) {
            Notification notification = new Notification();
            notification.setMessage("A new task \"" + task.getName() + "\" has been assigned to your team: " + team.getName());
            notification.setRecipientId(member);
            notification.setType(Notification.Type.ASSIGNED);
            notification.setTaskId(task);
            notificationRepository.save(notification);
        }
        return taskRepository.save(task);
    }
}
