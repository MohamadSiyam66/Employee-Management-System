package com.ems.backend.service;

import com.ems.backend.entity.EmployeeLeave;
import com.ems.backend.repository.LeaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRepository leaveRepository;

    @Override
    public List<EmployeeLeave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    @Override
    public EmployeeLeave saveLeave(EmployeeLeave leave) {

        // Calculate days and save in db, do not enter manually
        if (leave.getStartDate() != null && leave.getEndDate() != null) {
            long daysBetween = ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;
            leave.setDays((int) daysBetween);
        }

        // Set applied date, do not enter manually
        leave.setAppliedAt(LocalDate.now());

        return leaveRepository.save(leave);
    }

    @Override
    public EmployeeLeave updateLeave(Long id, EmployeeLeave updateLeave) {

        Optional<EmployeeLeave> leave = leaveRepository.findById(id);

        if (leave.isPresent()) {
            EmployeeLeave existingLeave = leave.get();
            // Update only status
            existingLeave.setStatus(updateLeave.getStatus());

            return leaveRepository.save(existingLeave);
        } else {
            throw new RuntimeException("Leave not found with id: " + id);
        }

    }

    @Override
    public List<EmployeeLeave> getLeavesByStatus(EmployeeLeave.LeaveStatus status) {
        return leaveRepository.findByStatus(status);
    }
}
