package com.ems.backend.repository;

import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientId(Employee employee);
    List<Notification> findByRecipientId_EmpId(Integer recipientId_empId);

}
