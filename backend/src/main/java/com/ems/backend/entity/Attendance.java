package com.ems.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "attendance")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer attId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "emp_id", referencedColumnName = "emp_id", foreignKey = @ForeignKey(name = "fk_attendance_employee"))
    private Employee employee;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private LocalTime loggedInTime;

    private LocalTime loggedOutTime;

    public enum Status {
        PRESENT,
        ABSENT
    }
}
