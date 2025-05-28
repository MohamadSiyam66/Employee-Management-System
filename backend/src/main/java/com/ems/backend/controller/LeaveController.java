package com.ems.backend.controller;

import com.ems.backend.entity.EmployeeLeave;
import com.ems.backend.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/leave")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173","https://ems-rubaai.web.app"}, allowCredentials = "true")
public class LeaveController {

    private final LeaveService leaveService;

    @GetMapping("leaves")
    public List<EmployeeLeave> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    @PostMapping("add")
    public EmployeeLeave saveLeave(@RequestBody EmployeeLeave employeeLeave) {
        return leaveService.saveLeave(employeeLeave);
    }

    @PutMapping("update/{leaveId}")
    public EmployeeLeave updateLeave(@PathVariable("leaveId") Long id,
                                     @RequestBody EmployeeLeave employeeLeave)
    {
        return leaveService.updateLeave(id,employeeLeave);
    }

    @GetMapping("leaves/{status}")
    public List<EmployeeLeave> getLeaveByStatus(@PathVariable("status") String status) {
        return leaveService.getLeavesByStatus(EmployeeLeave.LeaveStatus.valueOf(status));
    }
}
