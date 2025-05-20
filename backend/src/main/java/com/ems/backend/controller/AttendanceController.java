package com.ems.backend.controller;

import com.ems.backend.dto.AttendanceDTO;
import com.ems.backend.entity.Attendance;
import com.ems.backend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/attendance")
@RequiredArgsConstructor
@CrossOrigin
public class AttendanceController {

    private  final AttendanceService attendanceService;

    @GetMapping("attendances")
    public List<AttendanceDTO> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    @GetMapping("attendances/{date}")
    public List<Attendance> getAttendanceByDate(@PathVariable("date") String date ) {
        return attendanceService.getAttendanceByDate(LocalDate.parse(date));
    }

//    @GetMapping("allattendance")
//    public List<Attendance> getAttendance() {
//        return attendanceService.getAttendance();
//    }

    @PostMapping("add")
    public ResponseEntity<Attendance> addAttendance(@RequestBody Attendance attendance) {
        Attendance savedAttendance = attendanceService.saveAttendance(attendance);
        return ResponseEntity.ok(savedAttendance);
    }

    @PutMapping("update/{attId}") // sent attid in path and inside json empid
    public Attendance updateAttendance(@PathVariable Long attId, @RequestBody Attendance attendance) {
        return attendanceService.updateAttendance(attId, attendance);
    }

}
