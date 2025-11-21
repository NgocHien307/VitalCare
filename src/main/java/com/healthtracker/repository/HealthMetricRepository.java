package com.healthtracker.repository;

import com.healthtracker.model.HealthMetric;
import com.healthtracker.model.MetricType;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Repository for HealthMetric entity with custom queries and aggregations
 */
@Repository
public interface HealthMetricRepository extends MongoRepository<HealthMetric, String> {
    
    /**
     * Find all metrics for a user
     */
    List<HealthMetric> findByUserId(String userId);
    
    /**
     * Find metrics by user and measured after a specific date
     */
    List<HealthMetric> findByUserIdAndMeasuredAtAfter(String userId, LocalDateTime after);
    
    /**
     * Find metrics by user and metric type
     */
    List<HealthMetric> findByUserIdAndMetricType(String userId, MetricType metricType);
    
    /**
     * Find metrics by user, type, and date range
     */
    List<HealthMetric> findByUserIdAndMetricTypeAndMeasuredAtBetween(
        String userId, 
        MetricType metricType, 
        LocalDateTime start, 
        LocalDateTime end
    );
    
    /**
     * Get average blood pressure using MongoDB aggregation for performance
     * This avoids loading all data into memory
     */
    @Aggregation(pipeline = {
        "{ $match: { userId: ?0, metricType: 'BLOOD_PRESSURE', measuredAt: { $gte: ?1 } } }",
        "{ $group: { " +
        "    _id: null, " +
        "    avgSystolic: { $avg: '$systolic' }, " +
        "    avgDiastolic: { $avg: '$diastolic' }, " +
        "    count: { $sum: 1 } " +
        "} }"
    })
    Map<String, Object> getAverageBloodPressure(String userId, LocalDateTime since);
    
    /**
     * Get metric statistics by type
     */
    @Aggregation(pipeline = {
        "{ $match: { userId: ?0, metricType: ?1, measuredAt: { $gte: ?2 } } }",
        "{ $group: { " +
        "    _id: null, " +
        "    avg: { $avg: '$value' }, " +
        "    min: { $min: '$value' }, " +
        "    max: { $max: '$value' }, " +
        "    count: { $sum: 1 } " +
        "} }"
    })
    Map<String, Object> getMetricStatistics(String userId, String metricType, LocalDateTime since);
    
    /**
     * Delete metrics by user ID
     */
    void deleteByUserId(String userId);
}

