package com.example.dailyreportbackend;

import com.example.dailyreportbackend.controller.ReportController;
import com.example.dailyreportbackend.model.Report;
import com.example.dailyreportbackend.repository.ReportRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ReportControllerTest {

    @Mock
    private ReportRepository reportRepository;

    @InjectMocks
    private ReportController reportController;

    @Test
    public void testCreateReport() {
        // Arrange
        Report report = new Report();
        report.setTitle("Test Report");
        report.setContent("Test Content");
        report.setDate("2023-01-01");
        report.setTagId(1L);
        report.setUserId(1L);
        report.setProgress(75);
        report.setRemainingHours(5.5);
        report.setIssue("Test Issue");
        report.setSolution("Test Solution");

        when(reportRepository.save(any(Report.class))).thenReturn(report);

        // Act
        ResponseEntity<Report> response = reportController.createReport(report);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Test Report", response.getBody().getTitle());
        assertEquals(75, response.getBody().getProgress());
        assertEquals(5.5, response.getBody().getRemainingHours());
        verify(reportRepository, times(1)).save(any(Report.class));
    }

    @Test
    public void testGetReports() {
        // Arrange
        Report report1 = new Report();
        report1.setId(1L);
        report1.setTitle("Report 1");
        report1.setUserId(1L);

        Report report2 = new Report();
        report2.setId(2L);
        report2.setTitle("Report 2");
        report2.setUserId(1L);

        List<Report> reports = Arrays.asList(report1, report2);
        when(reportRepository.findByUserId(1L)).thenReturn(reports);

        // Act
        ResponseEntity<List<Report>> response = reportController.getReports(1L, null, null);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(reportRepository, times(1)).findByUserId(1L);
    }
} 