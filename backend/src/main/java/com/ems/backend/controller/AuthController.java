package com.ems.backend.controller;

import com.ems.backend.entity.Employee;
import com.ems.backend.repository.EmployeeRepository;
import com.ems.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
@CrossOrigin(origins = {"http://localhost:5173","https://ems-rubaai.web.app"}, allowCredentials = "true")
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
            response.put("name",emp.getUsername());
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
