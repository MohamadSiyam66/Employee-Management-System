package com.ems.backend.service;

import com.ems.backend.dto.NotificationDTO;
import com.ems.backend.entity.Task;
import com.ems.backend.entity.Notification;
import com.ems.backend.repository.TaskRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class ReminderService {

    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    // Runs every 4 hours between 8 AM and 6 PM daily (Colombo time)
    @Scheduled(fixedRate = 4 * 60 * 60 * 1000, zone = "Asia/Colombo")
    public void checkReminders() {
        // Get current time in Colombo timezone
        java.time.LocalTime now = java.time.LocalTime.now(java.time.ZoneId.of("Asia/Colombo"));

        // Only proceed if current time is between 8 AM and 6 PM
        if (now.getHour() >= 8 && now.getHour() < 18) {
            LocalDate today = LocalDate.now();
            List<Task> tasksDueForReminder = taskRepository.findByReminderDate(today);

            log.info("Found {} tasks with reminders due today", tasksDueForReminder.size());

            for (Task task : tasksDueForReminder) {
                try {
                    sendReminderNotification(task);
                } catch (Exception e) {
                    log.error("Failed to send reminder for task ID {}: {}", task.getId(), e.getMessage());
                }
            }
        }
    }

    void sendReminderNotification(Task task) {
        // Skip if no assigned employee
        if (task.getAssignedToId() == null) {
            log.debug("Task {} has no assigned employee, skipping reminder", task.getId());
            return;
        }

        NotificationDTO dto = new NotificationDTO();
        dto.setRecipientId(Long.valueOf(task.getAssignedToId().getEmpId()));
        dto.setTaskId(task.getId());
        dto.setType(Notification.Type.REMINDER.name()); // Use the enum value
        dto.setMessage("Reminder: Task '" + task.getName() + "' is due soon!");

        notificationService.sendNotification(dto);
        log.info("Sent reminder notification for task {}", task.getId());
    }
}