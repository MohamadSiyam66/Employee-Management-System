package com.ems.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "employee_leave")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeLeave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer leaveId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "emp_id", referencedColumnName = "emp_id", foreignKey = @ForeignKey(name = "fk_leave_employee"))
    private Employee employee;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false)
    private LeaveType leaveType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveStatus status = LeaveStatus.PENDING;

    @Column(nullable = false)
    private Integer days;

    @Column(name = "description")
    private String description;

    @Column(name = "applied_at")
    private LocalDate appliedAt;

    public enum LeaveType {
        CASUAL,
        MEDICAL
    }

    public enum LeaveStatus {
        APPROVED,
        PENDING,
        REJECTED
    }
}

