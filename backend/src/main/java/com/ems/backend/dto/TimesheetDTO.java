package com.ems.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimesheetDTO {
    private int timesheetId;
    private int employeeId;
    private String fName;
    private String lName;
    private LocalDate date;
    private String workHours;
    private String designation;
}
