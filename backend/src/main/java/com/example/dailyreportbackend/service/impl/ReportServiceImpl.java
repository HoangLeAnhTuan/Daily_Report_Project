package com.example.dailyreportbackend.service.impl;

import com.example.dailyreportbackend.exception.ResourceNotFoundException;
import com.example.dailyreportbackend.model.Report;
import com.example.dailyreportbackend.repository.ReportRepository;
import com.example.dailyreportbackend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Override
    public Report createReport(Report report) {
        return reportRepository.save(report);
    }

    @Override
    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", id));
    }

    @Override
    public List<Report> getReportsByUserId(Long userId) {
        return reportRepository.findByUserId(userId);
    }

    @Override
    public List<Report> getReportsByUserIdAndDate(Long userId, String date) {
        return reportRepository.findByUserIdAndDate(userId, date);
    }

    @Override
    public List<Report> getReportsByUserIdAndTagId(Long userId, Long tagId) {
        return reportRepository.findByUserIdAndTagId(userId, tagId);
    }

    @Override
    public Long countReportsByUserId(Long userId) {
        return reportRepository.countByUserId(userId);
    }

    @Override
    public void deleteReport(Long id) {
        Report report = getReportById(id);
        reportRepository.delete(report);
    }
    
    @Override
    public Page<Report> getReportsByUserIdPaged(Long userId, Pageable pageable) {
        return reportRepository.findByUserId(userId, pageable);
    }

    @Override
    public Page<Report> getReportsByUserIdAndDatePaged(Long userId, String date, Pageable pageable) {
        return reportRepository.findByUserIdAndDate(userId, date, pageable);
    }

    @Override
    public Page<Report> getReportsByUserIdAndTagIdPaged(Long userId, Long tagId, Pageable pageable) {
        return reportRepository.findByUserIdAndTagId(userId, tagId, pageable);
    }

    @Override
    public Page<Report> getReportsByUserIdAndDateAndTagIdPaged(Long userId, String date, Long tagId, Pageable pageable) {
        return reportRepository.findByUserIdAndDateAndTagId(userId, date, tagId, pageable);
    }

    @Override
    public List<Report> searchReportsByKeyword(Long userId, String keyword) {
        return reportRepository.searchByKeyword(userId, keyword);
    }

    @Override
    public Page<Report> searchReportsByKeywordPaged(Long userId, String keyword, Pageable pageable) {
        return reportRepository.searchByKeywordPaged(userId, keyword, pageable);
    }
} 