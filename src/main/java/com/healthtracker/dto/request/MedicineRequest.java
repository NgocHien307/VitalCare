package com.healthtracker.dto.request;

import com.healthtracker.model.MedicineSchedule;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineRequest {

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    @NotBlank(message = "Medicine type is required")
    private String medicineType;

    @NotBlank(message = "Dosage is required")
    private String dosage;

    private List<MedicineSchedule> schedules;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    private String purpose;

    private Boolean isActive;
}
