package com.example.dailyreportbackend.controller;

import com.example.dailyreportbackend.dto.LoginRequest;
import com.example.dailyreportbackend.dto.AuthResponse;
import com.example.dailyreportbackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody LoginRequest request) {
        try {
            System.out.println("Register request for email: " + request.getEmail());
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            throw e; // Để GlobalExceptionHandler xử lý
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Login request for email: " + request.getEmail());
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            throw e; // Để GlobalExceptionHandler xử lý
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            System.out.println("Forgot password request for email: " + email);
            Map<String, String> response = authService.forgotPassword(email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Forgot password error: " + e.getMessage());
            throw e; // Để GlobalExceptionHandler xử lý
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            System.out.println("Reset password request with token");
            Map<String, String> response = authService.resetPassword(token, newPassword);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Reset password error: " + e.getMessage());
            throw e; // Để GlobalExceptionHandler xử lý
        }
    }
} 