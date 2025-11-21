package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Embedded document representing a symptom pattern in disease mapping
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SymptomPattern {
    
    private String symptomName;
    
    /**
     * Weight of this symptom in disease diagnosis (0-100)
     */
    private Integer weight;
    
    /**
     * Whether this symptom is critical for diagnosis
     * If true and symptom is missing, the disease match score will be 0
     */
    private Boolean isCritical;
    
    /**
     * Additional qualifiers (e.g., "severe", "pulsating", "persistent")
     */
    private List<String> qualifiers;
}

