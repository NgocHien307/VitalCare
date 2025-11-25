package com.healthtracker.mapper;

import com.healthtracker.dto.response.MedicineResponse;
import com.healthtracker.model.Medicine;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Medicine entity and DTOs
 */
@Component
public class MedicineMapper {

    /**
     * Convert Medicine entity to Response DTO
     *
     * @param entity Medicine entity
     * @return MedicineResponse DTO (without userId)
     */
    public MedicineResponse toResponse(Medicine entity) {
        if (entity == null) {
            return null;
        }

        return MedicineResponse.builder()
                .id(entity.getId())
                .medicineName(entity.getMedicineName())
                .medicineType(entity.getMedicineType())
                .dosage(entity.getDosage())
                .schedules(entity.getSchedules())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .purpose(entity.getPurpose())
                .logs(entity.getLogs())
                .missedDoses(entity.getMissedDoses())
                .adherenceRate(entity.getAdherenceRate())
                .isActive(entity.getIsActive())
                .build();
    }

    /**
     * Convert list of Medicine entities to Response DTOs
     *
     * @param entities List of Medicine entities
     * @return List of MedicineResponse DTOs
     */
    public List<MedicineResponse> toResponseList(List<Medicine> entities) {
        if (entities == null) {
            return List.of();
        }

        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
