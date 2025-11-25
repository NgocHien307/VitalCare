package com.healthtracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for Appointment
 *
 * SECURITY: Does NOT expose userId
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {

    private String id;

    private String doctorName;

    private String specialty;

    private String hospital;

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
