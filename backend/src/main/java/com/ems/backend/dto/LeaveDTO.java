package com.ems.backend.dto;

import com.ems.backend.entity.EmployeeLeave;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveDTO {
    private int leaveId;
    private int empId;
    private String fName;
    private String lName;
    private String designation;
    private LocalDate startDate;
    private LocalDate endDate;
    private int days;
    private EmployeeLeave.LeaveStatus status;
    private EmployeeLeave.LeaveType type;
    private String description;
    private LocalDate appliedAt;

}
