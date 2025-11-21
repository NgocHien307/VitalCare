package com.healthtracker.dto.response;

import com.healthtracker.model.SymptomDiseaseMapping;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO representing a disease match with its confidence score
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiseaseMatchScore {
    
    private String diseaseName;
    
    private String diseaseNameEn;
    
    private String icdCode;
    
    private Double matchScore; // 0-1 (percentage of symptoms matched)
    
    private String category;
    
    private String severity;
    
    private List<String> generalRecommendations;
    
    private Boolean requiresImmediateAttention;
    
    public DiseaseMatchScore(SymptomDiseaseMapping mapping, double matchScore) {
        this.diseaseName = mapping.getDiseaseName();
        this.diseaseNameEn = mapping.getDiseaseNameEn();
        this.icdCode = mapping.getIcdCode();
        this.matchScore = matchScore;
        this.category = mapping.getCategory();
        this.severity = mapping.getSeverity();
        this.generalRecommendations = mapping.getGeneralRecommendations();
        this.requiresImmediateAttention = mapping.getRequiresImmediateAttention();
    }
}

