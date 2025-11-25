package com.healthtracker.dto.response;

import com.healthtracker.model.MedicineLog;
import com.healthtracker.model.MedicineSchedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Response DTO for Medicine
 *
 * SECURITY: Does NOT expose userId
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineResponse {

    private String id;

    private String medicineName;

    /**
     * Medicine type: TABLET, CAPSULE, LIQUID, INJECTION, INHALER, TOPICAL, OTHER
     */
    private String medicineType;

    private String dosage;

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

    private Boolean isActive;
}
