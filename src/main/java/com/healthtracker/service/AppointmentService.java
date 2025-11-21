package com.healthtracker.service;

import com.healthtracker.dto.request.AppointmentRequest;
import com.healthtracker.exception.BadRequestException;
import com.healthtracker.exception.ResourceNotFoundException;
import com.healthtracker.model.Appointment;
import com.healthtracker.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {
    
    private final AppointmentRepository appointmentRepository;
    
    public List<Appointment> getAllAppointments(String userId) {
        return appointmentRepository.findByUserIdOrderByAppointmentDateAsc(userId);
    }
    
    public List<Appointment> getUpcomingAppointments(String userId) {
        return appointmentRepository.findByUserIdAndAppointmentDateAfter(userId, LocalDateTime.now());
    }
    
    public Appointment getAppointmentById(String id, String userId) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        
        if (!appointment.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to access this appointment");
        }
        
        return appointment;
    }
    
    public Appointment addAppointment(String userId, AppointmentRequest request) {
        log.info("Adding new appointment for user: {}", userId);
        
        Appointment appointment = Appointment.builder()
                .userId(userId)
                .doctorName(request.getDoctorName())
                .specialty(request.getSpecialty())
                .hospital(request.getHospital())
                .appointmentDate(request.getAppointmentDate())
                .appointmentType(request.getAppointmentType())
                .status(request.getStatus() != null ? request.getStatus() : "SCHEDULED")
                .reason(request.getReason())
                .notes(request.getNotes())
                .build();
        
        return appointmentRepository.save(appointment);
    }
    
    public Appointment updateAppointment(String id, String userId, AppointmentRequest request) {
        Appointment appointment = getAppointmentById(id, userId);
        
        log.info("Updating appointment: {} for user: {}", id, userId);
        
        appointment.setDoctorName(request.getDoctorName());
        appointment.setSpecialty(request.getSpecialty());
        appointment.setHospital(request.getHospital());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentType(request.getAppointmentType());
        appointment.setStatus(request.getStatus());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        
        return appointmentRepository.save(appointment);
    }
    
    public void deleteAppointment(String id, String userId) {
        Appointment appointment = getAppointmentById(id, userId);
        log.info("Deleting appointment: {} for user: {}", id, userId);
        appointmentRepository.delete(appointment);
    }
}

