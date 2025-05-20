package com.ems.backend.service;

import com.ems.backend.dto.AttendanceDTO;
import com.ems.backend.entity.Attendance;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {

    List<AttendanceDTO> getAllAttendance();
//    List<Attendance> getAttendance();
    Attendance saveAttendance(Attendance attendance);
    Attendance updateAttendance(Long id, Attendance attendance);
    List<Attendance> getAttendanceByDate(LocalDate date);
}
