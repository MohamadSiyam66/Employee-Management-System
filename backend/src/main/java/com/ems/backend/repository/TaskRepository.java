package com.ems.backend.repository;

import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Employee assignedToId);
    List<Task> findByAssignedToId_EmpId(Long empId);
    List<Task> findByOwnerId(Employee ownerId);
    List<Task> findByReminderDate(LocalDate reminderDate);
    List<Task> findByTeam_Id(Long id);
}

