package com.ems.backend.controller;

import com.ems.backend.dto.NotificationDTO;
import com.ems.backend.entity.Notification;
import com.ems.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    public Notification sendNotification(@RequestBody NotificationDTO dto) {
        return notificationService.sendNotification(dto);
    }

    @GetMapping("/user/{empId}")
    public List<Notification> getNotifications(@PathVariable Long empId) {
        return notificationService.getNotificationsForUser(empId);
    }

    @PutMapping("/mark-all-read/{empId}")
    public void markAllAsRead(@PathVariable Long empId) {
        notificationService.markAllAsRead(empId);
    }
}
