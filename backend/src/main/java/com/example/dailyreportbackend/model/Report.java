package com.example.dailyreportbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String content;
    private String date;
    private Long tagId;
    private Long userId;
    private Integer progress;
    private Double remainingHours;
    private String issue;
    private String solution;
} 