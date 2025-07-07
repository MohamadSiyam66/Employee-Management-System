package com.ems.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "Candidate_document")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private Date joiningDate;
    private String ndaFilePath;
    private String uniIdFilePath;
    private String requestLetterFilePath;
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
