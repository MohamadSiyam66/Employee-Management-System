package com.ems.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimesheetDTO {
    private int timesheetId;
    private int employeeId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime lunchInTime;
    private LocalTime lunchOutTime;
    private LocalTime outTime;
    private LocalTime inTime;
    private LocalTime endTime;
    private String workHours;
    private String fname;
    private String lname;
}
