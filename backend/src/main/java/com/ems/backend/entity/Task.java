package com.ems.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate dueDate;
    private LocalDate reminderDate;
    private String rejectingReason;
    private Timestamp createdAt;

    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "emp_id", foreignKey = @ForeignKey(name = "fk_owner"))
    private Employee ownerId;

    @ManyToOne
    @JoinColumn(name = "assigned_to_id", referencedColumnName = "emp_id", foreignKey = @ForeignKey(name = "fk_assigned_to"))
    private Employee assignedToId;

    @ManyToOne
    @JoinColumn(name = "team_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "fk_assigned_team"))
    @JsonIgnore
    private Team team;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Task.Status status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Task.Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Task.AcceptingStatus AcceptingStatus;

    public enum AcceptingStatus { PENDING, ACCEPTED, REJECTED }
    public enum Priority { LOW, MEDIUM, HIGH}
    public enum Status { PENDING, IN_PROGRESS, COMPLETED }
}
