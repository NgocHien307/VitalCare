package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Health profile entity containing user's health information
 */
@Document(collection = "health_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthProfile {
    
    @Id
    private String id;
    
    private String userId;
    
    private Double height; // in cm
    
    private Double weight; // in kg
    
    private Double bmi;
    
    /**
     * BMI Category: UNDERWEIGHT, NORMAL, OVERWEIGHT, OBESE
     */
    private String bmiCategory;
    
    private String bloodType; // e.g., O+, A-, B+
    
    /**
     * List of chronic diseases (encrypted in production)
     */
    private List<String> chronicDiseases;
    
    /**
     * List of allergies (encrypted in production)
     */
    private List<String> allergies;
    
    /**
     * Family medical history (encrypted in production)
     */
    private List<String> familyMedicalHistory;
    
    /**
     * Smoking status: NEVER, FORMER, CURRENT
     */
    private String smokingStatus;
    
    /**
     * Alcohol consumption: NEVER, OCCASIONAL, MODERATE, HEAVY
     */
    private String alcoholConsumption;
    
    /**
     * Exercise frequency: SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE
     */
    private String exerciseFrequency;
    
    private Integer sleepHoursPerDay;
    
    private EmergencyContact emergencyContact;
}

