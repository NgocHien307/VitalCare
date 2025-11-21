package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Symptom-disease mapping entity - Reference data for DSS symptom analysis
 * This collection contains the knowledge base for mapping symptoms to diseases
 */
@Document(collection = "symptom_disease_mapping")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SymptomDiseaseMapping {
    
    @Id
    private String id;
    
    private String diseaseName;
    
    private String diseaseNameEn;
    
    /**
     * ICD-10 code for the disease
     */
    private String icdCode;
    
    /**
     * List of symptom patterns associated with this disease
     * IMPORTANT: Indexed for performance - query optimization!
     */
    @Indexed
    private List<SymptomPattern> symptomPatterns;
    
    /**
     * Disease category: NEUROLOGICAL, CARDIOVASCULAR, RESPIRATORY, DIGESTIVE, etc.
     */
    private String category;
    
    /**
     * Severity: MILD, MODERATE, SEVERE, CRITICAL
     */
    private String severity;
    
    /**
     * General recommendations for this condition
     */
    private List<String> generalRecommendations;
    
    /**
     * Whether this condition requires immediate medical attention
     */
    private Boolean requiresImmediateAttention;
}

