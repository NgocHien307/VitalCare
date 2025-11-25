package com.healthtracker.controller;

import com.healthtracker.dto.request.HealthMetricRequest;
import com.healthtracker.dto.response.HealthMetricResponse;
import com.healthtracker.mapper.HealthMetricMapper;
import com.healthtracker.model.HealthMetric;
import com.healthtracker.model.MetricType;
import com.healthtracker.service.IHealthMetricService;
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
 *
 * SECURITY: Returns DTOs instead of entities to prevent information leakage
 * (userId NOT exposed)
 */
@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class HealthMetricController {

    private final IHealthMetricService healthMetricService;
    private final HealthMetricMapper healthMetricMapper;

    /**
     * Get all metrics for authenticated user
     *
     * @return List of HealthMetricResponse DTOs (userId NOT exposed)
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<HealthMetricResponse>> getAllMetrics(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername(); // Using email as userId
        List<HealthMetric> metrics = healthMetricService.getAllMetrics(userId);
        List<HealthMetricResponse> responses = healthMetricMapper.toResponseList(metrics);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get metrics by type
     *
     * @return List of HealthMetricResponse DTOs (userId NOT exposed)
     */
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<HealthMetricResponse>> getMetricsByType(
            @PathVariable MetricType type,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<HealthMetric> metrics = healthMetricService.getMetricsByType(userId, type);
        List<HealthMetricResponse> responses = healthMetricMapper.toResponseList(metrics);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get recent metrics
     *
     * @return List of HealthMetricResponse DTOs (userId NOT exposed)
     */
    @GetMapping("/recent")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<HealthMetricResponse>> getRecentMetrics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<HealthMetric> metrics = healthMetricService.getRecentMetrics(userId, since);
        List<HealthMetricResponse> responses = healthMetricMapper.toResponseList(metrics);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get metric by ID
     *
     * @return HealthMetricResponse DTO (userId NOT exposed)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<HealthMetricResponse> getMetricById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        HealthMetric metric = healthMetricService.getMetricById(id, userId);
        HealthMetricResponse response = healthMetricMapper.toResponse(metric);
        return ResponseEntity.ok(response);
    }

    /**
     * Add new metric
     *
     * @return HealthMetricResponse DTO (userId NOT exposed)
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<HealthMetricResponse> addMetric(
            @Valid @RequestBody HealthMetricRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        HealthMetric metric = healthMetricService.addMetric(userId, request);
        HealthMetricResponse response = healthMetricMapper.toResponse(metric);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update metric
     *
     * @return HealthMetricResponse DTO (userId NOT exposed)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<HealthMetricResponse> updateMetric(
            @PathVariable String id,
            @Valid @RequestBody HealthMetricRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        HealthMetric metric = healthMetricService.updateMetric(id, userId, request);
        HealthMetricResponse response = healthMetricMapper.toResponse(metric);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete metric
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Void> deleteMetric(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        healthMetricService.deleteMetric(id, userId);
        return ResponseEntity.noContent().build();
    }
}
