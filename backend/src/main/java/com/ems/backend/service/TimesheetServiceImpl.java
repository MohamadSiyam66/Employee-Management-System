package com.ems.backend.service;

import com.ems.backend.dto.TimesheetDTO;
import com.ems.backend.entity.Timesheet;
import com.ems.backend.exception.TimesheetNotFoundException;
import com.ems.backend.repository.TimesheetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimesheetServiceImpl implements TimesheetService {

    private final TimesheetRepository timesheetRepository;

    @Override
    public List<TimesheetDTO> getAllTimesheet() {
        return timesheetRepository.findAll().stream()
                .map(tmsheet -> new TimesheetDTO(
                        tmsheet.getTimesheetId(),
                        tmsheet.getEmployee().getEmpId(),
                        tmsheet.getDate(),
                        tmsheet.getStartTime(),
                        tmsheet.getLunchInTime(),
                        tmsheet.getLunchOutTime(),
                        tmsheet.getOutTime(),
                        tmsheet.getInTime(),
                        tmsheet.getEndTime(),
                        tmsheet.getWorkHours(),
                        tmsheet.getEmployee().getFname(),
                        tmsheet.getEmployee().getLname(),
                        tmsheet.getWorkSummery()
                ))
                .collect(Collectors.toList());
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
        StringBuilder errorMessages = new StringBuilder();

        if (updateTimesheet.getLunchOutTime() != null) {
            if (existingTmsheet.getLunchOutTime() == null) {
                existingTmsheet.setLunchOutTime(updateTimesheet.getLunchOutTime());
            } else {
                errorMessages.append("Lunch out time cannot be updated again. ");
            }
        }

        if (updateTimesheet.getLunchInTime() != null) {
            if (existingTmsheet.getLunchInTime() == null) {
                existingTmsheet.setLunchInTime(updateTimesheet.getLunchInTime());
            } else {
                errorMessages.append("Lunch in time cannot be updated again. ");
            }
        }

        // If any error occurred, throw combined message
        if (!errorMessages.isEmpty()) {
            throw new RuntimeException(errorMessages.toString().trim());
        }

        // Calculate work hours
//        if (existingTmsheet.getStartTime() != null && existingTmsheet.getEndTime() != null)
//        {
//
//            long totalMinutes = Duration.between(existingTmsheet.getStartTime(), existingTmsheet.getEndTime()).toMinutes();
//
//            // Let lunchtime to 0 by default
//            long lunchMinutes = 0;
//            if (existingTmsheet.getOutTime() != null && existingTmsheet.getInTime() != null) {
//                lunchMinutes = Duration.between(existingTmsheet.getLunchOutTime(), existingTmsheet.getLunchInTime()).toMinutes();
//            }
//
//            // Let out time to 0 by default
//            long outMinutes = 0;
//            if (existingTmsheet.getOutTime() != null && existingTmsheet.getInTime() != null) {
//                outMinutes = Duration.between(existingTmsheet.getOutTime(), existingTmsheet.getInTime()).toMinutes();
//            }
//
//            long netMinutes = totalMinutes - (lunchMinutes + outMinutes);
//            long netSeconds = netMinutes * 60;
//
//            Duration duration = Duration.ofSeconds(netSeconds);
//
//            long hours = duration.toHours();
//            long minutes = duration.toMinutesPart();
////            long seconds = duration.toSecondsPart();
//
//            String formatted = String.format("%02d:%02d", hours, minutes);
//            existingTmsheet.setWorkHours(formatted);
//        }

        if (updateTimesheet.getOutTime() != null) {
            existingTmsheet.setOutTime(updateTimesheet.getOutTime());
        }
        if (updateTimesheet.getInTime() != null) {
            existingTmsheet.setInTime(updateTimesheet.getInTime());
        }
        if (updateTimesheet.getEndTime() != null) {
            existingTmsheet.setEndTime(updateTimesheet.getEndTime());
        }
        if (updateTimesheet.getWorkHours() != null) {
            existingTmsheet.setWorkHours(updateTimesheet.getWorkHours());
        }
        if (updateTimesheet.getWorkSummery() != null) {
            existingTmsheet.setWorkSummery(updateTimesheet.getWorkSummery());
        }

        return timesheetRepository.save(existingTmsheet);
    }

    @Override
    public Optional<Integer> getTimesheetIdByEmpIdAndDate(Integer empId, LocalDate date) {
        return timesheetRepository.findByEmployeeEmpIdAndDate(empId, date)
                .map(Timesheet::getTimesheetId);
    }


}
