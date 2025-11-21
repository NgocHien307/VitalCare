package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Embedded document for medicine schedule
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineSchedule {
    
    /**
     * Time of day: MORNING, AFTERNOON, EVENING, NIGHT, BEFORE_MEAL, AFTER_MEAL
     */
    private String timeOfDay;
    
    /**
     * Specific time in HH:mm format (e.g., "08:00")
     */
    private String specificTime;
    
    /**
     * Frequency: DAILY, WEEKLY, BIWEEKLY, MONTHLY, AS_NEEDED
     */
    private String frequency;
    
    /**
     * Days of week (for WEEKLY frequency): MONDAY, TUESDAY, etc.
     */
    private List<String> daysOfWeek;
}

