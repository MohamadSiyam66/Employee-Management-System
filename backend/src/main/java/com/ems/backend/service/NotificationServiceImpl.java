package com.ems.backend.service;

import com.ems.backend.dto.NotificationDTO;
import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Notification;
import com.ems.backend.entity.Task;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.repository.NotificationRepository;
import com.ems.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmployeeRepository employeeRepository;
    private final TaskRepository taskRepository;

    @Override
    public Notification sendNotification(NotificationDTO dto) {
        Notification notification = new Notification();
        Employee recipient = employeeRepository.findById(dto.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        notification.setRecipientId(recipient);

        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
        notification.setTaskId(task);

        notification.setMessage(dto.getMessage());
        notification.setType(Notification.Type.valueOf(dto.getType()));

        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getNotificationsForUser(Long userId) {
        Employee emp = employeeRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return notificationRepository.findByRecipientId(emp);
    }

    @Override
    public void markAllAsRead(Long userId) {
        Employee emp = employeeRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        List<Notification> notifications = notificationRepository.findByRecipientId(emp);
        for (Notification n : notifications) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(notifications);
    }
}
