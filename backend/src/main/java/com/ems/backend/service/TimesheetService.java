package com.ems.backend.service;

import com.ems.backend.dto.TimesheetDTO;
import com.ems.backend.entity.Timesheet;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TimesheetService {
    List<TimesheetDTO> getAllTimesheet();
    Timesheet saveTimesheet(Timesheet timesheet);
    Timesheet updateTimesheet(Long id, Timesheet timesheet);
    Optional<Integer> getTimesheetIdByEmpIdAndDate(Integer empId, LocalDate date);

}
