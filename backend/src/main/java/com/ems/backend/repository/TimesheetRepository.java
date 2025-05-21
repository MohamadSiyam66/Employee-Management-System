package com.ems.backend.repository;


import com.ems.backend.entity.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {
    boolean existsByEmployeeEmpIdAndDate(Integer employee_empId, LocalDate date);

}
