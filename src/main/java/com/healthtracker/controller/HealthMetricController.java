package com.healthtracker.controller;

import com.healthtracker.dto.request.HealthMetricRequest;
import com.healthtracker.model.HealthMetric;
import com.healthtracker.model.MetricType;
import com.healthtracker.service.HealthMetricService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller for health metrics endpoints
 */
@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class HealthMetricController {
    
    private final HealthMetricService healthMetricService;
    
    /**
     * Get all metrics for authenticated user
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<HealthMetric>> getAllMetrics(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername(); // Using email as userId
        List<HealthMetric> metrics = healthMetricService.getAllMetrics(userId);
        return ResponseEntity.ok(metrics);
    }
    
    /**
     * Get metrics by type
     */
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<HealthMetric>> getMetricsByType(
            @PathVariable MetricType type,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<HealthMetric> metrics = healthMetricService.getMetricsByType(userId, type);
        return ResponseEntity.ok(metrics);
    }
    
    /**
     * Get recent metrics
     */
    @GetMapping("/recent")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<HealthMetric>> getRecentMetrics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<HealthMetric> metrics = healthMetricService.getRecentMetrics(userId, since);
        return ResponseEntity.ok(metrics);
    }
    
    /**
     * Get metric by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<HealthMetric> getMetricById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        HealthMetric metric = healthMetricService.getMetricById(id, userId);
        return ResponseEntity.ok(metric);
    }
    
    /**
     * Add new metric
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<HealthMetric> addMetric(
            @Valid @RequestBody HealthMetricRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        HealthMetric metric = healthMetricService.addMetric(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(metric);
    }
    
    /**
     * Update metric
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<HealthMetric> updateMetric(
            @PathVariable String id,
            @Valid @RequestBody HealthMetricRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        HealthMetric metric = healthMetricService.updateMetric(id, userId, request);
        return ResponseEntity.ok(metric);
    }
    
    /**
     * Delete metric
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Void> deleteMetric(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        healthMetricService.deleteMetric(id, userId);
        return ResponseEntity.noContent().build();
    }
}

