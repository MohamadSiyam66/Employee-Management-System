package com.ems.backend.exception;

public class TimesheetNotFoundException extends RuntimeException {
    public TimesheetNotFoundException(Long id) {
        super("Timesheet not found with id: " + id);
    }
}
