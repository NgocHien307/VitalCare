package com.healthtracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for symptom analysis response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SymptomAnalysisResponse {
    
    private List<DiseaseMatchScore> possibleConditions;
    
    private Double urgencyScore; // 0-100
    
    private String urgencyLevel; // LOW, MODERATE, HIGH
    
    private List<String> recommendations;
    
    private String analysisNote;
    
    /**
     * Factory method for no symptoms case
     */
    public static SymptomAnalysisResponse noSymptoms() {
        return SymptomAnalysisResponse.builder()
                .possibleConditions(List.of())
                .urgencyScore(0.0)
                .urgencyLevel("NONE")
                .recommendations(List.of("Không có triệu chứng nào đang được theo dõi"))
                .analysisNote("Bạn không có triệu chứng nào đang hoạt động")
                .build();
    }
}

