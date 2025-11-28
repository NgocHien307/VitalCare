package com.healthtracker.service;

import com.healthtracker.dto.request.HealthMetricRequest;
import com.healthtracker.exception.BadRequestException;
import com.healthtracker.exception.ResourceNotFoundException;
import com.healthtracker.model.HealthMetric;
import com.healthtracker.model.MetricType;
import com.healthtracker.repository.HealthMetricRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of health metrics operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HealthMetricService implements IHealthMetricService {

    private final HealthMetricRepository healthMetricRepository;
    private final MessageSource messageSource;

    /**
     * Get all metrics for a user
     */
    @Override
    public List<HealthMetric> getAllMetrics(String userId) {
        return healthMetricRepository.findByUserId(userId);
    }

    /**
     * Get metrics by type for a user
     */
    @Override
    public List<HealthMetric> getMetricsByType(String userId, MetricType metricType) {
        return healthMetricRepository.findByUserIdAndMetricType(userId, metricType);
    }

    /**
     * Get recent metrics for a user
     */
    @Override
    public List<HealthMetric> getRecentMetrics(String userId, LocalDateTime since) {
        return healthMetricRepository.findByUserIdAndMeasuredAtAfter(userId, since);
    }

    /**
     * Get a specific metric by ID
     */
    @Override
    public HealthMetric getMetricById(String id, String userId) {
        HealthMetric metric = healthMetricRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        getMessage("error.resource.notfound.healthmetric", id)));

        // Verify ownership
        if (!metric.getUserId().equals(userId)) {
            throw new BadRequestException(getMessage("error.permission.denied"));
        }

        return metric;
    }

    /**
     * Add a new health metric
     */
    @Override
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
    @Override
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
    @Override
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
            metric.setAnalysisNote(getMessage("health.metric.bloodpressure.critical"));
        } else if (systolic >= 140 || diastolic >= 90) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote(getMessage("health.metric.bloodpressure.high"));
        } else if (systolic < 90 || diastolic < 60) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote(getMessage("health.metric.bloodpressure.low"));
        } else {
            metric.setStatus("NORMAL");
            metric.setAnalysisNote(getMessage("health.metric.bloodpressure.normal"));
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
            metric.setAnalysisNote(getMessage("health.metric.bloodsugar.critical"));
        } else if (value >= 126) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote(getMessage("health.metric.bloodsugar.high"));
        } else if (value < 70) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote(getMessage("health.metric.bloodsugar.low"));
        } else {
            metric.setStatus("NORMAL");
            metric.setAnalysisNote(getMessage("health.metric.bloodsugar.normal"));
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
            metric.setAnalysisNote(getMessage("health.metric.heartrate.critical"));
        } else if (value > 100 || value < 50) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote(getMessage("health.metric.heartrate.warning"));
        } else {
            metric.setStatus("NORMAL");
            metric.setAnalysisNote(getMessage("health.metric.heartrate.normal"));
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
            metric.setAnalysisNote(getMessage("health.metric.temperature.critical"));
        } else if (value >= 37.5) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote(getMessage("health.metric.temperature.warning"));
        } else if (value < 35.0) {
            metric.setStatus("WARNING");
            metric.setAnalysisNote(getMessage("health.metric.temperature.low"));
        } else {
            metric.setStatus("NORMAL");
            metric.setAnalysisNote(getMessage("health.metric.temperature.normal"));
        }
    }

    /**
     * Helper method to get localized message
     */
    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    /**
     * Helper method to get localized message with parameters
     */
    private String getMessage(String code, Object... args) {
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }
}
