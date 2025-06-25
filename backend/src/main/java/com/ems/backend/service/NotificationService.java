package com.ems.backend.service;

import com.ems.backend.dto.NotificationDTO;
import com.ems.backend.entity.Notification;

import java.util.List;

public interface NotificationService {
    Notification sendNotification(NotificationDTO dto);
    List<Notification> getNotificationsForUser(Long userId);
    void markAllAsRead(Long userId);
}
