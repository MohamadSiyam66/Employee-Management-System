package com.ems.backend.repository;


import com.ems.backend.entity.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {
    boolean existsByEmployeeEmpIdAndDate(Integer employee_empId, LocalDate date);
    Optional<Timesheet> findByEmployeeEmpIdAndDate(Integer empId, LocalDate date);


}
