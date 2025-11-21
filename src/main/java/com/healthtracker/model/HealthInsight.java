package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Health insight entity - DSS output for health recommendations and warnings
 */
@Document(collection = "health_insights")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthInsight {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private InsightType type;
    
    /**
     * Category: BLOOD_PRESSURE, WEIGHT, SYMPTOMS, MEDICATION, EXERCISE, DIET, etc.
     */
    private String category;
    
    private String title;
    
    private String message;
    
    private String actionableAdvice;
    
    /**
     * Related data points for context
     */
    private Map<String, Object> dataPoints;
    
    /**
     * Priority level: 1 (highest) to 3 (lowest)
     */
    private Integer priority;
    
    /**
     * Severity: INFO, WARNING, CRITICAL
     */
    private String severity;
    
    @Indexed
    private Boolean isRead;
    
    private LocalDateTime generatedAt;
    
    /**
     * Insight expires after this date
     */
    private LocalDateTime expiresAt;
}

