package com.ems.backend.repository;

import com.ems.backend.dto.AttendanceDTO;
import com.ems.backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByDate(LocalDate date);
    Optional<Attendance> findByEmployeeEmpIdAndDate(Integer employee_empId, LocalDate date);
}
