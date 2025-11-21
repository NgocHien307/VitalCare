package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Appointment entity for managing medical appointments
 */
@Document(collection = "appointments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String doctorName;
    
    private String specialty;
    
    private String hospital;
    
    @Indexed
    private LocalDateTime appointmentDate;
    
    /**
     * Appointment type: CHECK_UP, FOLLOW_UP, EMERGENCY, CONSULTATION, PROCEDURE
     */
    private String appointmentType;
    
    /**
     * Status: SCHEDULED, COMPLETED, CANCELLED, MISSED
     */
    private String status;
    
    private String reason;
    
    private String notes;
}

