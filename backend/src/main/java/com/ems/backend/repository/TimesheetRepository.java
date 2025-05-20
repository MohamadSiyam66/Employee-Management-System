package com.ems.backend.repository;


import com.ems.backend.entity.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {

}
