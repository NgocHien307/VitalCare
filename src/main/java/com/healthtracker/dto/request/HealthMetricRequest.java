package com.healthtracker.dto.request;

import com.healthtracker.model.MetricType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for health metric request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetricRequest {

    @NotNull(message = "Metric type is required")
    private MetricType metricType;

    private Double value;

    private Double systolic;

    private Double diastolic;

    private String unit;

    @NotNull(message = "Measured date/time is required")
    @PastOrPresent(message = "Measured date/time cannot be in the future")
    private LocalDateTime measuredAt;

    private String notes;
}
