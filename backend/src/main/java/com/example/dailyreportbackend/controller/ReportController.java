package com.example.dailyreportbackend.controller;

import com.example.dailyreportbackend.model.Report;
import com.example.dailyreportbackend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping
    public ResponseEntity<List<Report>> getReports(
            @RequestParam Long userId,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Long tagId) {
        try {
            System.out.println("Getting reports for userId: " + userId + 
                    (date != null ? ", date: " + date : "") + 
                    (tagId != null ? ", tagId: " + tagId : ""));
            
            List<Report> reports;
            if (date != null) {
                reports = reportService.getReportsByUserIdAndDate(userId, date);
            } else if (tagId != null) {
                reports = reportService.getReportsByUserIdAndTagId(userId, tagId);
            } else {
                reports = reportService.getReportsByUserId(userId);
            }
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            System.out.println("Error getting reports: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/paged")
    public ResponseEntity<Map<String, Object>> getPagedReports(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Long tagId,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            System.out.println("Getting paged reports for userId: " + userId + 
                    ", page: " + page + 
                    ", size: " + size +
                    (date != null ? ", date: " + date : "") + 
                    (tagId != null ? ", tagId: " + tagId : ""));
            
            Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            
            Page<Report> reportPage;
            try {
                if (date != null && tagId != null) {
                    reportPage = reportService.getReportsByUserIdAndDateAndTagIdPaged(userId, date, tagId, pageable);
                } else if (date != null) {
                    reportPage = reportService.getReportsByUserIdAndDatePaged(userId, date, pageable);
                } else if (tagId != null) {
                    reportPage = reportService.getReportsByUserIdAndTagIdPaged(userId, tagId, pageable);
                } else {
                    reportPage = reportService.getReportsByUserIdPaged(userId, pageable);
                }
                
                List<Report> reports = reportPage.getContent();
                
                Map<String, Object> response = new HashMap<>();
                response.put("reports", reports);
                response.put("currentPage", reportPage.getNumber());
                response.put("totalItems", reportPage.getTotalElements());
                response.put("totalPages", reportPage.getTotalPages());
                
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                System.out.println("Database error in paged reports: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            System.out.println("Error getting paged reports: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Report>> searchReports(
            @RequestParam Long userId,
            @RequestParam String searchTerm) {
        try {
            System.out.println("Searching reports for userId: " + userId + ", term: " + searchTerm);
            
            List<Report> reports = reportService.searchReportsByKeyword(userId, searchTerm);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            System.out.println("Error searching reports: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search/paged")
    public ResponseEntity<Map<String, Object>> searchReportsPaged(
            @RequestParam Long userId,
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            System.out.println("Searching paged reports for userId: " + userId + 
                    ", term: " + searchTerm +
                    ", page: " + page + 
                    ", size: " + size);
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Report> reportPage = reportService.searchReportsByKeywordPaged(userId, searchTerm, pageable);
            
            List<Report> reports = reportPage.getContent();
            
            Map<String, Object> response = new HashMap<>();
            response.put("reports", reports);
            response.put("currentPage", reportPage.getNumber());
            response.put("totalItems", reportPage.getTotalElements());
            response.put("totalPages", reportPage.getTotalPages());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error searching paged reports: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        try {
            System.out.println("Getting report with id: " + id);
            Report report = reportService.getReportById(id);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            System.out.println("Error getting report: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countReports(@RequestParam Long userId) {
        try {
            System.out.println("Counting reports for userId: " + userId);
            Long count = reportService.countReportsByUserId(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.out.println("Error counting reports: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        try {
            System.out.println("Creating report: " + report.getTitle() + 
                    ", progress: " + report.getProgress() + 
                    ", hours: " + report.getRemainingHours());
            Report savedReport = reportService.createReport(report);
            return ResponseEntity.status(201).body(savedReport);
        } catch (Exception e) {
            System.out.println("Error creating report: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        try {
            System.out.println("Deleting report with id: " + id);
            reportService.deleteReport(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error deleting report: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
} 