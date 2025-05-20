package com.ems.backend.service;

import com.ems.backend.dto.LoginRequestDTO;
import com.ems.backend.dto.LoginResponseDTO;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO request);
    ResponseEntity<String> logout();
}
