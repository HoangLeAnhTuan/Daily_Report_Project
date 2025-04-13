package com.example.dailyreportbackend.service.impl;

import com.example.dailyreportbackend.dto.AuthResponse;
import com.example.dailyreportbackend.dto.LoginRequest;
import com.example.dailyreportbackend.exception.JwtException;
import com.example.dailyreportbackend.exception.ResourceNotFoundException;
import com.example.dailyreportbackend.model.User;
import com.example.dailyreportbackend.repository.UserRepository;
import com.example.dailyreportbackend.security.JwtUtil;
import com.example.dailyreportbackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public AuthResponse register(LoginRequest request) {
        // Kiểm tra email đã tồn tại chưa
        User existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser != null) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        // Tạo user mới
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Lưu user vào database
        User savedUser = userRepository.save(user);

        // Tạo token JWT
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId());

        // Trả về response
        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), "Đăng ký thành công");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Tìm user bằng email
        User user = userRepository.findByEmail(request.getEmail());
        
        // Kiểm tra user và mật khẩu
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không chính xác");
        }

        // Tạo token JWT
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        // Trả về response
        return new AuthResponse(token, user.getId(), user.getEmail(), "Đăng nhập thành công");
    }

    @Override
    public Map<String, String> forgotPassword(String email) {
        User user = userRepository.findByEmail(email);
        
        if (user == null) {
            throw new ResourceNotFoundException("User", "email", email);
        }

        // Tạo token reset password
        String resetToken = jwtUtil.generateToken(email, user.getId());
        
        // Trong thực tế, bạn sẽ gửi email chứa token này
        System.out.println("Reset password token for " + email + ": " + resetToken);
        
        // Lưu token vào database
        user.setResetToken(resetToken);
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Liên kết đặt lại mật khẩu đã được gửi tới email của bạn");
        return response;
    }

    @Override
    public Map<String, String> resetPassword(String token, String newPassword) {
        // Xác thực token
        try {
            if (!jwtUtil.validateToken(token, jwtUtil.extractUsername(token))) {
                throw new JwtException("Token không hợp lệ hoặc đã hết hạn");
            }
        } catch (Exception e) {
            throw new JwtException("Token không hợp lệ", e);
        }

        // Tìm user bằng userId từ token
        Long userId = jwtUtil.extractUserId(token);
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundException("User", "id", userId);
        }

        User user = userOptional.get();
        
        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null); // Xóa token reset
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Đặt lại mật khẩu thành công");
        return response;
    }
} 