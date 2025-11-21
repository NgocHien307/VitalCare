package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Embedded document for medicine intake log
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineLog {
    
    private LocalDateTime scheduledTime;
    
    private LocalDateTime actualTime;
    
    /**
     * Status: TAKEN, MISSED, SKIPPED
     */
    private String status;
    
    private String notes;
}

