package com.example.dailyreportbackend.exception;

public class JwtException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;
    
    public JwtException(String message) {
        super(message);
    }
    
    public JwtException(String message, Throwable cause) {
        super(message, cause);
    }
} 