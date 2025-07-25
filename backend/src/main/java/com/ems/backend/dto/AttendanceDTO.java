package com.ems.backend.dto;

import com.ems.backend.entity.Attendance;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDTO {
    private int attId;
    private int empId;
    private String fname;
    private String lname;
    private LocalDate date;
    private Attendance.Status status;
    private String designation;
    private LocalTime loggedInTime;
    private LocalTime loggedOutTime;
}
