package com.healthtracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for Symptom
 *
 * SECURITY: Does NOT expose userId
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SymptomResponse {

    private String id;

    private String symptomName;

    private String bodyPart;

    /**
     * Severity level from 1 (mild) to 10 (severe)
     */
    private Integer severity;

    private LocalDateTime startDate;

    /**
     * End date (null if symptom is still active)
     */
    private LocalDateTime endDate;

    /**
     * Frequency: CONSTANT, INTERMITTENT, OCCASIONAL
     */
    private String frequency;

    /**
     * Known triggers for the symptom
     */
    private List<String> triggers;

    private String description;

    /**
     * Related symptoms that occur together
     */
    private List<String> relatedSymptoms;

    /**
     * Possible conditions identified by DSS
     */
    private List<String> possibleConditions;

    /**
     * Urgency score calculated by DSS (0-100)
     */
    private Double urgencyScore;
}
