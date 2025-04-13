package com.example.dailyreportbackend.repository;

import com.example.dailyreportbackend.model.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUserId(Long userId);
    List<Report> findByUserIdAndDate(Long userId, String date);
    List<Report> findByUserIdAndTagId(Long userId, Long tagId);
    Long countByUserId(Long userId);
    
    // Phương thức mới với phân trang
    Page<Report> findByUserId(Long userId, Pageable pageable);
    Page<Report> findByUserIdAndDate(Long userId, String date, Pageable pageable);
    Page<Report> findByUserIdAndTagId(Long userId, Long tagId, Pageable pageable);
    Page<Report> findByUserIdAndDateAndTagId(Long userId, String date, Long tagId, Pageable pageable);
    
    // Phương thức tìm kiếm
    @Query("SELECT r FROM Report r WHERE r.userId = :userId AND " +
           "(LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.issue) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.solution) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Report> searchByKeyword(@Param("userId") Long userId, @Param("keyword") String keyword);
    
    @Query("SELECT r FROM Report r WHERE r.userId = :userId AND " +
           "(LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.issue) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.solution) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Report> searchByKeywordPaged(@Param("userId") Long userId, @Param("keyword") String keyword, Pageable pageable);
} 