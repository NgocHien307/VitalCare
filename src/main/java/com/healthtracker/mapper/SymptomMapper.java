package com.healthtracker.mapper;

import com.healthtracker.dto.response.SymptomResponse;
import com.healthtracker.model.Symptom;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Symptom entity and DTOs
 */
@Component
public class SymptomMapper {

    /**
     * Convert Symptom entity to Response DTO
     *
     * @param entity Symptom entity
     * @return SymptomResponse DTO (without userId)
     */
    public SymptomResponse toResponse(Symptom entity) {
        if (entity == null) {
            return null;
        }

        return SymptomResponse.builder()
                .id(entity.getId())
                .symptomName(entity.getSymptomName())
                .bodyPart(entity.getBodyPart())
                .severity(entity.getSeverity())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .frequency(entity.getFrequency())
                .triggers(entity.getTriggers())
                .description(entity.getDescription())
                .relatedSymptoms(entity.getRelatedSymptoms())
                .possibleConditions(entity.getPossibleConditions())
                .urgencyScore(entity.getUrgencyScore())
                .build();
    }

    /**
     * Convert list of Symptom entities to Response DTOs
     *
     * @param entities List of Symptom entities
     * @return List of SymptomResponse DTOs
     */
    public List<SymptomResponse> toResponseList(List<Symptom> entities) {
        if (entities == null) {
            return List.of();
        }

        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
