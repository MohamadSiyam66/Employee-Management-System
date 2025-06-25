package com.ems.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private Boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Notification.Type type;

    @ManyToOne
    @JoinColumn(name = "recipient_id", referencedColumnName = "emp_id", foreignKey = @ForeignKey(name = "fk_recipient"))
    private Employee recipientId;

    @ManyToOne
    @JoinColumn(name = "task_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "fk_task"))
    private Task taskId;

    public enum Type { ASSIGNED, ACCEPTED, REJECTED, COMPLETED , IN_PROGRESS, REMINDER }
}
