package com.ems.backend.controller;

import com.ems.backend.dto.LoginRequestDTO;
import com.ems.backend.dto.LoginResponseDTO;
import com.ems.backend.entity.Employee;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.service.AuthService;
import com.ems.backend.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmployeeRepository employeeRepository;

    // login
    @PostMapping("login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Employee loginDetails) {
        Employee emp = employeeRepository.findByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if(emp.getPassword().equals(loginDetails.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("id",emp.getEmpId());
            response.put("role",emp.getRole());
            return ResponseEntity.ok(response);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout successful");
    }
}
