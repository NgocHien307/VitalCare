package com.healthtracker.controller;

import com.healthtracker.dto.request.AppointmentRequest;
import com.healthtracker.dto.response.AppointmentResponse;
import com.healthtracker.mapper.AppointmentMapper;
import com.healthtracker.model.Appointment;
import com.healthtracker.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for appointments endpoints
 *
 * SECURITY: Returns DTOs instead of entities to prevent information leakage (userId NOT exposed)
 */
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AppointmentMapper appointmentMapper;

    /**
     * Get all appointments for authenticated user
     *
     * @return List of AppointmentResponse DTOs (userId NOT exposed)
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<Appointment> appointments = appointmentService.getAllAppointments(userId);
        List<AppointmentResponse> responses = appointmentMapper.toResponseList(appointments);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get upcoming appointments
     *
     * @return List of AppointmentResponse DTOs (userId NOT exposed)
     */
    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<AppointmentResponse>> getUpcomingAppointments(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<Appointment> appointments = appointmentService.getUpcomingAppointments(userId);
        List<AppointmentResponse> responses = appointmentMapper.toResponseList(appointments);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get appointment by ID
     *
     * @return AppointmentResponse DTO (userId NOT exposed)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<AppointmentResponse> getAppointmentById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Appointment appointment = appointmentService.getAppointmentById(id, userId);
        AppointmentResponse response = appointmentMapper.toResponse(appointment);
        return ResponseEntity.ok(response);
    }

    /**
     * Add new appointment
     *
     * @return AppointmentResponse DTO (userId NOT exposed)
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<AppointmentResponse> addAppointment(
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Appointment appointment = appointmentService.addAppointment(userId, request);
        AppointmentResponse response = appointmentMapper.toResponse(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update appointment
     *
     * @return AppointmentResponse DTO (userId NOT exposed)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<AppointmentResponse> updateAppointment(
            @PathVariable String id,
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Appointment appointment = appointmentService.updateAppointment(id, userId, request);
        AppointmentResponse response = appointmentMapper.toResponse(appointment);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete appointment
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Void> deleteAppointment(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        appointmentService.deleteAppointment(id, userId);
        return ResponseEntity.noContent().build();
    }
}
