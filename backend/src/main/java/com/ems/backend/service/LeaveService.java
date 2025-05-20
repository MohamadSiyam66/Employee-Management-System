package com.ems.backend.service;

import com.ems.backend.entity.EmployeeLeave;

import java.util.List;

public interface LeaveService {
    List<EmployeeLeave> getAllLeaves();
    EmployeeLeave saveLeave (EmployeeLeave leave);
    EmployeeLeave updateLeave (Long id, EmployeeLeave leave);
    List<EmployeeLeave> getLeavesByStatus(EmployeeLeave.LeaveStatus status);

}
