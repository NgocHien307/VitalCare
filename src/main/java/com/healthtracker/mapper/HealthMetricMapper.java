package com.healthtracker.mapper;

import com.healthtracker.dto.response.HealthMetricResponse;
import com.healthtracker.model.HealthMetric;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between HealthMetric entity and DTOs
 */
@Component
public class HealthMetricMapper {

    /**
     * Convert HealthMetric entity to Response DTO
     *
     * @param entity HealthMetric entity
     * @return HealthMetricResponse DTO (without userId)
     */
    public HealthMetricResponse toResponse(HealthMetric entity) {
        if (entity == null) {
            return null;
        }

        return HealthMetricResponse.builder()
                .id(entity.getId())
                .metricType(entity.getMetricType())
                .value(entity.getValue())
                .systolic(entity.getSystolic())
                .diastolic(entity.getDiastolic())
                .unit(entity.getUnit())
                .measuredAt(entity.getMeasuredAt())
                .notes(entity.getNotes())
                .status(entity.getStatus())
                .analysisNote(entity.getAnalysisNote())
                .build();
    }

    /**
     * Convert list of HealthMetric entities to Response DTOs
     *
     * @param entities List of HealthMetric entities
     * @return List of HealthMetricResponse DTOs
     */
    public List<HealthMetricResponse> toResponseList(List<HealthMetric> entities) {
        if (entities == null) {
            return List.of();
        }

        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
