package com.healthtracker.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for symptom request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SymptomRequest {
    
    @NotBlank(message = "Symptom name is required")
    @Size(min = 2, max = 100, message = "Symptom name must be between 2-100 characters")
    private String symptomName;
    
    @NotBlank(message = "Body part is required")
    private String bodyPart;
    
    @NotNull(message = "Severity is required")
    @Min(value = 1, message = "Severity must be between 1-10")
    @Max(value = 10, message = "Severity must be between 1-10")
    private Integer severity;
    
    @NotNull(message = "Start date is required")
    @PastOrPresent(message = "Start date cannot be in the future")
    private LocalDateTime startDate;
    
    @PastOrPresent(message = "End date cannot be in the future")
    private LocalDateTime endDate;
    
    @Pattern(regexp = "CONSTANT|INTERMITTENT|OCCASIONAL", 
             message = "Frequency must be CONSTANT, INTERMITTENT, or OCCASIONAL")
    private String frequency;
    
    private List<String> triggers;
    
    private String description;
    
    private List<String> relatedSymptoms;
}

