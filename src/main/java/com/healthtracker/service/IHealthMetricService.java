package com.healthtracker.service;

import com.healthtracker.dto.request.HealthMetricRequest;
import com.healthtracker.model.HealthMetric;
import com.healthtracker.model.MetricType;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Interface for health metrics operations
 * 
 * Provides contract for managing health metrics including CRUD operations
 * and metric analysis for blood pressure, blood sugar, heart rate, and
 * temperature.
 */
public interface IHealthMetricService {

    /**
     * Get all metrics for a user
     * 
     * @param userId The user's ID
     * @return List of all health metrics for the user
     */
    List<HealthMetric> getAllMetrics(String userId);

    /**
     * Get metrics by type for a user
     * 
     * @param userId     The user's ID
     * @param metricType The type of metric to filter by
     * @return List of health metrics of the specified type
     */
    List<HealthMetric> getMetricsByType(String userId, MetricType metricType);

    /**
     * Get recent metrics for a user since a specific date
     * 
     * @param userId The user's ID
     * @param since  The start date for filtering
     * @return List of health metrics recorded after the specified date
     */
    List<HealthMetric> getRecentMetrics(String userId, LocalDateTime since);

    /**
     * Get a specific metric by ID
     * 
     * @param id     The metric ID
     * @param userId The user's ID (for ownership verification)
     * @return The health metric
     * @throws com.healthtracker.exception.ResourceNotFoundException if metric not
     *                                                               found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the metric
     */
    HealthMetric getMetricById(String id, String userId);

    /**
     * Add a new health metric
     * 
     * @param userId  The user's ID
     * @param request The metric data
     * @return The created health metric with analysis status
     */
    HealthMetric addMetric(String userId, HealthMetricRequest request);

    /**
     * Update an existing metric
     * 
     * @param id      The metric ID
     * @param userId  The user's ID (for ownership verification)
     * @param request The updated metric data
     * @return The updated health metric
     * @throws com.healthtracker.exception.ResourceNotFoundException if metric not
     *                                                               found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the metric
     */
    HealthMetric updateMetric(String id, String userId, HealthMetricRequest request);

    /**
     * Delete a metric
     * 
     * @param id     The metric ID
     * @param userId The user's ID (for ownership verification)
     * @throws com.healthtracker.exception.ResourceNotFoundException if metric not
     *                                                               found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the metric
     */
    void deleteMetric(String id, String userId);
}
