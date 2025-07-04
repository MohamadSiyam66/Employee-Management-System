package com.ems.backend.controller;

import com.ems.backend.dto.TimesheetDTO;
import com.ems.backend.entity.Timesheet;
import com.ems.backend.service.TimesheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/timesheet")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TimesheetController {

    private final TimesheetService timesheetService;

    @GetMapping("timesheets")
    public List<TimesheetDTO> getAllTimesheets() {
        return timesheetService.getAllTimesheet();
    }

    @PostMapping("add")
    public Timesheet saveTimesheet(@RequestBody Timesheet timesheet) {
        return timesheetService.saveTimesheet(timesheet);
    }

    @PutMapping("update/{tmsheetId}")
    public Timesheet updateTimesheet(@PathVariable("tmsheetId") Long id, @RequestBody Timesheet timesheet) {
        return timesheetService.updateTimesheet(id, timesheet);
    }

    @GetMapping("/get-id/{empId}/{date}")
    public ResponseEntity<Integer> getTimesheetIdByEmpIdAndDate(
            @PathVariable Integer empId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return timesheetService.getTimesheetIdByEmpIdAndDate(empId, date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


}
