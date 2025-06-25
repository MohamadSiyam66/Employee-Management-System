package com.ems.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskUpdateDTO {
    private Long assignedToId;
    private String acceptingStatus;
    private String rejectingReason;
    private String status;

}
