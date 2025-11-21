package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Symptom entity for tracking user symptoms
 */
@Document(collection = "symptoms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Symptom {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
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
    @Indexed
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

