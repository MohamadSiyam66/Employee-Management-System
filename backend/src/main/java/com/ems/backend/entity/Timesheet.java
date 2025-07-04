package com.ems.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "timesheet")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Timesheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer timesheetId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "emp_id", referencedColumnName = "emp_id", foreignKey = @ForeignKey(name = "fk_timesheet_employee"))
    private Employee employee;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "lunch_out_time")
    private LocalTime lunchOutTime;

    @Column(name = "lunch_in_time")
    private LocalTime lunchInTime;

    @Column(name = "out_time")
    private LocalTime outTime;

    @Column(name = "in_time")
    private LocalTime inTime;

    @Column(name = "work_hours")
    private String workHours;

    @Column(name = "work_summery")
    private String workSummery;

}
