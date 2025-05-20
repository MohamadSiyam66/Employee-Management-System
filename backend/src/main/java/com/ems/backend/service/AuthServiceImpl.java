package com.ems.backend.service;

import com.ems.backend.dto.LoginRequestDTO;
import com.ems.backend.dto.LoginResponseDTO;
import com.ems.backend.entity.Employee;
import com.ems.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final EmployeeRepository employeeRepository;

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        // Fetch employee by email
        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Validate password
        if (!employee.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        LoginResponseDTO response = new LoginResponseDTO(
                "Login successful",
                employee.getRole(),
                employee.getEmpId()
        );

        return response;
    }

    @Override
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout successful");
    }
}
