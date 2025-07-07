package com.ems.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateDTO {
    private String name;
    private String email;
    private String joiningDate;
    private String uniIdFilePath;
    private String requestLetterFilePath;
    private String ndaFilePath;
    private String questions;
}
