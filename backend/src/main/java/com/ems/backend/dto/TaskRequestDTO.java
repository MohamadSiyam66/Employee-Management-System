package com.ems.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequestDTO {
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate dueDate;
    private LocalDate reminderDate;
    private String rejectingReason;
    private String status;
    private String priority;
    private String acceptingStatus;
    private Long ownerId;
}
