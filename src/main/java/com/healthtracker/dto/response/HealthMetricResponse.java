package com.healthtracker.dto.response;

import com.healthtracker.model.MetricType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for Health Metric
 *
 * SECURITY: Does NOT expose userId to prevent information leakage
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetricResponse {

    private String id;

    private MetricType metricType;

    /**
     * General value for simple metrics (weight, heart rate, etc.)
     */
    private Double value;

    /**
     * Systolic blood pressure (for BLOOD_PRESSURE type)
     */
    private Double systolic;

    /**
     * Diastolic blood pressure (for BLOOD_PRESSURE type)
     */
    private Double diastolic;

    private String unit;

    private LocalDateTime measuredAt;

    private String notes;

    /**
     * Status: NORMAL, WARNING, CRITICAL
     */
    private String status;

    private String analysisNote;
}
