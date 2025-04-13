package com.example.dailyreportbackend.service;

import com.example.dailyreportbackend.model.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReportService {
    Report createReport(Report report);
    Report getReportById(Long id);
    List<Report> getReportsByUserId(Long userId);
    List<Report> getReportsByUserIdAndDate(Long userId, String date);
    List<Report> getReportsByUserIdAndTagId(Long userId, Long tagId);
    Long countReportsByUserId(Long userId);
    void deleteReport(Long id);
    
    // Phương thức mới với phân trang
    Page<Report> getReportsByUserIdPaged(Long userId, Pageable pageable);
    Page<Report> getReportsByUserIdAndDatePaged(Long userId, String date, Pageable pageable);
    Page<Report> getReportsByUserIdAndTagIdPaged(Long userId, Long tagId, Pageable pageable);
    Page<Report> getReportsByUserIdAndDateAndTagIdPaged(Long userId, String date, Long tagId, Pageable pageable);
    
    // Phương thức tìm kiếm
    List<Report> searchReportsByKeyword(Long userId, String keyword);
    Page<Report> searchReportsByKeywordPaged(Long userId, String keyword, Pageable pageable);
} 