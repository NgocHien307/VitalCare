package com.healthtracker.controller;

import com.healthtracker.dto.request.AppointmentRequest;
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

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    
    private final AppointmentService appointmentService;
    
    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<Appointment>> getAllAppointments(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<Appointment> appointments = appointmentService.getAllAppointments(userId);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<Appointment>> getUpcomingAppointments(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<Appointment> appointments = appointmentService.getUpcomingAppointments(userId);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Appointment> getAppointmentById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Appointment appointment = appointmentService.getAppointmentById(id, userId);
        return ResponseEntity.ok(appointment);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Appointment> addAppointment(
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Appointment appointment = appointmentService.addAppointment(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable String id,
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Appointment appointment = appointmentService.updateAppointment(id, userId, request);
        return ResponseEntity.ok(appointment);
    }
    
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

