package com.ems.backend.service;

import com.ems.backend.dto.TaskUpdateDTO;
import com.ems.backend.entity.Task;

import java.util.List;

public interface TaskService {
    Task createTask(Task task);
    Task updateTask(Long id, TaskUpdateDTO dto);
    List<Task> getTasksByEmployee(Long empId);
    List<Task> getAllTasks();
    Task assignTeamToTask(Long taskId, Integer teamId);
}
