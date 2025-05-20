package com.ems.backend.service;

import com.ems.backend.dto.TimesheetDTO;
import com.ems.backend.entity.Timesheet;
import com.ems.backend.exception.TimesheetNotFoundException;
import com.ems.backend.repository.TimesheetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimesheetServiceImpl implements TimesheetService {

    private final TimesheetRepository timesheetRepository;

    @Override
    public List<TimesheetDTO> getAllTimesheet() {
        // Getting all data
        List<Timesheet> timesheets = timesheetRepository.findAll();
        // Returning only needed data
        return timesheets.stream().map(tmsheet -> new TimesheetDTO(
                tmsheet.getTimesheetId(),
                tmsheet.getEmployee().getFname(),
                tmsheet.getEmployee().getLname(),
                tmsheet.getDate(),
                tmsheet.getWorkHours(),
                tmsheet.getEmployee().getDesignation()
        )).collect(Collectors.toList());
    }

    @Override
    public Timesheet saveTimesheet(Timesheet timesheet) {
        return timesheetRepository.save(timesheet);
    }

    @Override
    public Timesheet updateTimesheet(Long id, Timesheet updateTimesheet) {
        Timesheet existingTmsheet = timesheetRepository.findById(id)
                .orElseThrow(() -> new TimesheetNotFoundException(id));

        // Check null in existingTimesheet to update
        if (existingTmsheet.getStartTime() == null && updateTimesheet.getStartTime() != null) {
            existingTmsheet.setStartTime(updateTimesheet.getStartTime());
        }

        if (existingTmsheet.getLunchOutTime() == null && updateTimesheet.getLunchOutTime() != null) {
            existingTmsheet.setLunchOutTime(updateTimesheet.getLunchOutTime());
        }

        if (existingTmsheet.getLunchInTime() == null && updateTimesheet.getLunchInTime() != null) {
            existingTmsheet.setLunchInTime(updateTimesheet.getLunchInTime());
        }

        if (existingTmsheet.getOutTime() == null && updateTimesheet.getOutTime() != null) {
            existingTmsheet.setOutTime(updateTimesheet.getOutTime());
        }

        if (existingTmsheet.getInTime() == null && updateTimesheet.getInTime() != null) {
            existingTmsheet.setInTime(updateTimesheet.getInTime());
        }

        if (existingTmsheet.getEndTime() == null && updateTimesheet.getEndTime() != null) {
            existingTmsheet.setEndTime(updateTimesheet.getEndTime());
        }

        // Calculate work hours
        if (existingTmsheet.getStartTime() != null && existingTmsheet.getEndTime() != null)
        {

            long totalMinutes = Duration.between(existingTmsheet.getStartTime(), existingTmsheet.getEndTime()).toMinutes();

            // Let lunchtime to 0 by default
            long lunchMinutes = 0;
            if (existingTmsheet.getOutTime() != null && existingTmsheet.getInTime() != null) {
                lunchMinutes = Duration.between(existingTmsheet.getLunchOutTime(), existingTmsheet.getLunchInTime()).toMinutes();
            }

            // Let out time to 0 by default
            long outMinutes = 0;
            if (existingTmsheet.getOutTime() != null && existingTmsheet.getInTime() != null) {
                outMinutes = Duration.between(existingTmsheet.getOutTime(), existingTmsheet.getInTime()).toMinutes();
            }

            long netMinutes = totalMinutes - (lunchMinutes + outMinutes);
            long netSeconds = netMinutes * 60;

            Duration duration = Duration.ofSeconds(netSeconds);

            long hours = duration.toHours();
            long minutes = duration.toMinutesPart();
            long seconds = duration.toSecondsPart();

            String formatted = String.format("%02d:%02d:%02d", hours, minutes, seconds);
            existingTmsheet.setWorkHours(formatted);
        }

        return timesheetRepository.save(existingTmsheet);
    }


}
