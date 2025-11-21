package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

/**
 * Medicine entity for tracking medications
 */
@Document(collection = "medicines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String medicineName;
    
    /**
     * Medicine type: TABLET, CAPSULE, LIQUID, INJECTION, INHALER, TOPICAL, OTHER
     */
    private String medicineType;
    
    private String dosage; // e.g., "10mg", "5ml"
    
    private List<MedicineSchedule> schedules;
    
    private LocalDate startDate;
    
    /**
     * End date (null for ongoing medication)
     */
    private LocalDate endDate;
    
    private String purpose;
    
    private List<MedicineLog> logs;
    
    private Integer missedDoses;
    
    /**
     * Adherence rate as percentage (0-100)
     */
    private Double adherenceRate;
    
    @Indexed
    private Boolean isActive;
}

