package com.ems.backend.dto;

import com.ems.backend.entity.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String message;
    private Employee.Role role;
    private int empId;
}
