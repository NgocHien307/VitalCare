package com.healthtracker.mapper;

import com.healthtracker.dto.response.AppointmentResponse;
import com.healthtracker.model.Appointment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Appointment entity and DTOs
 */
@Component
public class AppointmentMapper {

    /**
     * Convert Appointment entity to Response DTO
     *
     * @param entity Appointment entity
     * @return AppointmentResponse DTO (without userId)
     */
    public AppointmentResponse toResponse(Appointment entity) {
        if (entity == null) {
            return null;
        }

        return AppointmentResponse.builder()
                .id(entity.getId())
                .doctorName(entity.getDoctorName())
                .specialty(entity.getSpecialty())
                .hospital(entity.getHospital())
                .appointmentDate(entity.getAppointmentDate())
                .appointmentType(entity.getAppointmentType())
                .status(entity.getStatus())
                .reason(entity.getReason())
                .notes(entity.getNotes())
                .build();
    }

    /**
     * Convert list of Appointment entities to Response DTOs
     *
     * @param entities List of Appointment entities
     * @return List of AppointmentResponse DTOs
     */
    public List<AppointmentResponse> toResponseList(List<Appointment> entities) {
        if (entities == null) {
            return List.of();
        }

        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
