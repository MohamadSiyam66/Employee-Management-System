package com.ems.backend.service;

import com.ems.backend.dto.AttendanceDTO;
import com.ems.backend.entity.Attendance;
import com.ems.backend.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;

    @Override
    public List<AttendanceDTO> getAllAttendance() {
        List<Attendance> attList = attendanceRepository.findAll();
        return attList.stream().map(att -> new AttendanceDTO(
                att.getAttId(),
                att.getEmployee().getEmpId(),
                att.getEmployee().getFname(),
                att.getEmployee().getLname(),
                att.getDate(),
                att.getStatus(),
                att.getEmployee().getDesignation(),
                att.getLoggedInTime(),
                att.getLoggedOutTime()
        )).collect(Collectors.toList());
    }

//    @Override
//    public List<Attendance> getAttendance() {
//        return attendanceRepository.findAll();
//    }

    @Override
    public Attendance saveAttendance(Attendance attendance) {

        if (attendance.getEmployee() == null) {
            throw new IllegalArgumentException("Employee must be specified for attendance");
        }

        if (attendance.getStatus() == Attendance.Status.ABSENT) {
            attendance.setLoggedInTime(null);
            attendance.setLoggedOutTime(null);
        }

        return attendanceRepository.save(attendance);
    }

    /*  json for testing saveAttendance api
    {
        "employee": {
        "empId": 2
    },
        "date": "2025-05-19",
            "status": "ABSENT",
            "loggedInTime": "2025-05-16T09:00:00"
    }
    */

    @Override
    public Attendance updateAttendance(Long attId, Attendance updatedAtt) {
        Attendance existingAtt = attendanceRepository.findById(attId)
                .orElseThrow(() -> new IllegalArgumentException("Attendance not found for: " + attId));

        // Update status and times
        if (updatedAtt.getStatus() != null) {
            existingAtt.setStatus(updatedAtt.getStatus());

            // Clear times if status is ABSENT
            if (updatedAtt.getStatus() == Attendance.Status.ABSENT) {
                existingAtt.setLoggedInTime(null);
                existingAtt.setLoggedOutTime(null);
            }
        }

        // Update times only if status is PRESENT
        if (existingAtt.getStatus() == Attendance.Status.PRESENT) {
            if (updatedAtt.getLoggedInTime() != null) {
                existingAtt.setLoggedInTime(updatedAtt.getLoggedInTime());
            }
            if (updatedAtt.getLoggedOutTime() != null) {
                existingAtt.setLoggedOutTime(updatedAtt.getLoggedOutTime());
            }
        }

        return attendanceRepository.save(existingAtt);
    }

    @Override
    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }
}
