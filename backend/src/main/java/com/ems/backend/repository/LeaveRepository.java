package com.ems.backend.repository;

import com.ems.backend.entity.EmployeeLeave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository extends JpaRepository<EmployeeLeave, Long> {
    List<EmployeeLeave> findByStatus(EmployeeLeave.LeaveStatus status);
}
