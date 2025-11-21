package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Health metric entity for time-series health data
 */
@Document(collection = "health_metrics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetric {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
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
    
    private String unit; // e.g., kg, mmHg, mg/dL, bpm, °C
    
    @Indexed
    private LocalDateTime measuredAt;
    
    private String notes;
    
    /**
     * Status: NORMAL, WARNING, CRITICAL
     */
    private String status;
    
    private String analysisNote;
}

