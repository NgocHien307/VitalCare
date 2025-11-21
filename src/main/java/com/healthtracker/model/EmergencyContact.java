package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded document for emergency contact information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyContact {
    
    private String name;
    
    private String relationship;
    
    private String phoneNumber;
}

