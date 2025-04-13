package com.example.dailyreportbackend.service;

import com.example.dailyreportbackend.dto.AuthResponse;
import com.example.dailyreportbackend.dto.LoginRequest;
import com.example.dailyreportbackend.model.User;

import java.util.Map;

public interface AuthService {
    AuthResponse register(LoginRequest request);
    AuthResponse login(LoginRequest request);
    Map<String, String> forgotPassword(String email);
    Map<String, String> resetPassword(String token, String newPassword);
} 