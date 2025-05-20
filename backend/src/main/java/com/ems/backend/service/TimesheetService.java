package com.ems.backend.service;

import com.ems.backend.dto.TimesheetDTO;
import com.ems.backend.entity.Timesheet;

import java.util.List;

public interface TimesheetService {
    List<TimesheetDTO> getAllTimesheet();
    Timesheet saveTimesheet(Timesheet timesheet);
    Timesheet updateTimesheet(Long id, Timesheet timesheet);
}
