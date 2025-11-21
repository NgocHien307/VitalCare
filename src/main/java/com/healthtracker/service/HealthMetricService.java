package com.healthtracker.service;

import com.healthtracker.dto.request.HealthMetricRequest;
import com.healthtracker.exception.BadRequestException;
import com.healthtracker.exception.ResourceNotFoundException;
import com.healthtracker.model.HealthMetric;
import com.healthtracker.model.MetricType;
import com.healthtracker.repository.HealthMetricRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for health metrics operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HealthMetricService {
    
    private final HealthMetricRepository healthMetricRepository;
    
    /**
     * Get all metrics for a user
     */
    public List<HealthMetric> getAllMetrics(String userId) {
        return healthMetricRepository.findByUserId(userId);
    }
    
    /**
     * Get metrics by type for a user
     */
    public List<HealthMetric> getMetricsByType(String userId, MetricType metricType) {
        return healthMetricRepository.findByUserIdAndMetricType(userId, metricType);
    }
    
    /**
     * Get recent metrics for a user
     */
    public List<HealthMetric> getRecentMetrics(String userId, LocalDateTime since) {
        return healthMetricRepository.findByUserIdAndMeasuredAtAfter(userId, since);
    }
    
    /**
     * Get a specific metric by ID
     */
    public HealthMetric getMetricById(String id, String userId) {
        HealthMetric metric = healthMetricRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HealthMetric", "id", id));
        
        // Verify ownership
        if (!metric.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to access this metric");
        }
        
        return metric;
    }
    
    /**
     * Add a new health metric
     */
    public HealthMetric addMetric(String userId, HealthMetricRequest request) {
        log.info("Adding new metric for user: {}, type: {}", userId, request.getMetricType());
        
        HealthMetric metric = HealthMetric.builder()
                .userId(userId)
                .metricType(request.getMetricType())
                .value(request.getValue())
                .systolic(request.getSystolic())
                .diastolic(request.getDiastolic())
                .unit(request.getUnit())
                .measuredAt(request.getMeasuredAt())
                .notes(request.getNotes())
                .build();
        
        // Analyze and set status
        analyzeMetric(metric);
        
        return healthMetricRepository.save(metric);
    }
    
    /**
     * Update an existing metric
     */
    public HealthMetric updateMetric(String id, String userId, HealthMetricRequest request) {
        HealthMetric metric = getMetricById(id, userId);
        
        log.info("Updating metric: {} for user: {}", id, userId);
        
        metric.setMetricType(request.getMetricType());
        metric.setValue(request.getValue());
        metric.setSystolic(request.getSystolic());
        metric.setDiastolic(request.getDiastolic());
        metric.setUnit(request.getUnit());
        metric.setMeasuredAt(request.getMeasuredAt());
        metric.setNotes(request.getNotes());
        
        // Re-analyze
        analyzeMetric(metric);
        
        return healthMetricRepository.save(metric);
    }
    
    /**
     * Delete a metric
     */
    public void deleteMetric(String id, String userId) {
        HealthMetric metric = getMetricById(id, userId);
        log.info("Deleting metric: {} for user: {}", id, userId);
        healthMetricRepository.delete(metric);
    }
    
    /**
     * Analyze metric and set status
     */
    private void analyzeMetric(HealthMetric metric) {
        switch (metric.getMetricType()) {
            case BLOOD_PRESSURE:
                analyzeBloodPressure(metric);
                break;
            case BLOOD_SUGAR:
                analyzeBloodSugar(metric);
                break;
            case HEART_RATE:
                analyzeHeartRate(metric);
                break;
            case BODY_TEMPERATURE:
                analyzeBodyTemperature(metric);
                break;
            default:
                metric.setStatus("NORMAL");
        }
    }
    
    private void analyzeBloodPressure(HealthMetric metric) {
        if (metric.getSystolic() == null || metric.getDiastolic() == null) {
            metric.setStatus("NORMAL");
            return;
        }
        
        double systolic = metric.getSystolic();
        double diastolic = metric.getDiastolic();
        
        if (systolic >= 180 || diastolic >= 120) {
            metric.setStatus("CRITICAL");
            metric.setAnalysisNote("Huyết áp rất cao - Cần gặp bác sĩ ngay");
        } else if (systolic >= 140 || diastolic >= 90) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote("Huyết áp cao - Nên kiểm tra với bác sĩ");
        } else if (systolic < 90 || diastolic < 60) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote("Huyết áp thấp");
        } else {
            metric.setStatus("NORMAL");
            metric.setAnalysisNote("Huyết áp bình thường");
        }
    }
    
    private void analyzeBloodSugar(HealthMetric metric) {
        if (metric.getValue() == null) {
            metric.setStatus("NORMAL");
            return;
        }
        
        double value = metric.getValue();
        
        if (value >= 200) {
            metric.setStatus("CRITICAL");
            metric.setAnalysisNote("Đường huyết rất cao - Cần gặp bác sĩ ngay");
        } else if (value >= 126) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote("Đường huyết cao - Nguy cơ tiểu đường");
        } else if (value < 70) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote("Đường huyết thấp");
        } else {
            metric.setStatus("NORMAL");
            metric.setAnalysisNote("Đường huyết bình thường");
        }
    }
    
    private void analyzeHeartRate(HealthMetric metric) {
        if (metric.getValue() == null) {
            metric.setStatus("NORMAL");
            return;
        }
        
        double value = metric.getValue();
        
        if (value > 120 || value < 40) {
            metric.setStatus("CRITICAL");
            metric.setAnalysisNote("Nhịp tim bất thường - Cần gặp bác sĩ");
        } else if (value > 100 || value < 50) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote("Nhịp tim nằm ngoài phạm vi bình thường");
        } else {
            metric.setStatus("NORMAL");
            metric.setAnalysisNote("Nhịp tim bình thường");
        }
    }
    
    private void analyzeBodyTemperature(HealthMetric metric) {
        if (metric.getValue() == null) {
            metric.setStatus("NORMAL");
            return;
        }
        
        double value = metric.getValue();
        
        if (value >= 39.0) {
            metric.setStatus("CRITICAL");
            metric.setAnalysisNote("Sốt cao - Cần gặp bác sĩ");
        } else if (value >= 37.5) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote("Sốt nhẹ");
        } else if (value < 35.0) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote("Nhiệt độ thấp");
        } else {
            metric.setStatus("NORMAL");
            metric.setAnalysisNote("Nhiệt độ bình thường");
        }
    }
}

