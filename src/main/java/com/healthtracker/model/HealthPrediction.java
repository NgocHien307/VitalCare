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
 * Health prediction entity - DSS output for risk predictions and health trends
 */
@Document(collection = "health_predictions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthPrediction {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private PredictionType predictionType;
    
    /**
     * Target condition being predicted (e.g., "Cardiovascular Disease", "Type 2 Diabetes")
     */
    private String targetCondition;
    
    /**
     * Risk score (0-100)
     */
    private Double riskScore;
    
    /**
     * Risk level: LOW, MODERATE, HIGH, VERY_HIGH
     */
    private String riskLevel;
    
    private String prediction;
    
    /**
     * Factors contributing to risk
     */
    private List<String> riskFactors;
    
    /**
     * Factors protecting against risk
     */
    private List<String> protectiveFactors;
    
    /**
     * Recommendations to reduce risk
     */
    private List<String> recommendations;
    
    /**
     * Algorithm used for prediction (e.g., "Cardiovascular-Risk-Score-v1")
     */
    private String algorithm;
    
    /**
     * Confidence score of the prediction (0-100)
     */
    private Double confidenceScore;
    
    private LocalDateTime predictedAt;
    
    /**
     * Prediction is valid until this date
     */
    @Indexed
    private LocalDateTime validUntil;
}

