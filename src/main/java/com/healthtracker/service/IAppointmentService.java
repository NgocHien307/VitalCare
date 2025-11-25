package com.healthtracker.service;

import com.healthtracker.dto.request.AppointmentRequest;
import com.healthtracker.model.Appointment;

import java.util.List;

/**
 * Interface for appointment management operations
 * 
 * Provides contract for managing user appointments including CRUD operations
 * and upcoming appointment tracking.
 */
public interface IAppointmentService {

    /**
     * Get all appointments for a user, ordered by date ascending
     * 
     * @param userId The user's ID
     * @return List of all appointments for the user
     */
    List<Appointment> getAllAppointments(String userId);

    /**
     * Get upcoming appointments for a user (appointments after current time)
     * 
     * @param userId The user's ID
     * @return List of upcoming appointments
     */
    List<Appointment> getUpcomingAppointments(String userId);

    /**
     * Get a specific appointment by ID
     * 
     * @param id     The appointment ID
     * @param userId The user's ID (for ownership verification)
     * @return The appointment
     * @throws com.healthtracker.exception.ResourceNotFoundException if appointment
     *                                                               not found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the
     *                                                               appointment
     */
    Appointment getAppointmentById(String id, String userId);

    /**
     * Add a new appointment
     * 
     * @param userId  The user's ID
     * @param request The appointment data
     * @return The created appointment
     */
    Appointment addAppointment(String userId, AppointmentRequest request);

    /**
     * Update an existing appointment
     * 
     * @param id      The appointment ID
     * @param userId  The user's ID (for ownership verification)
     * @param request The updated appointment data
     * @return The updated appointment
     * @throws com.healthtracker.exception.ResourceNotFoundException if appointment
     *                                                               not found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the
     *                                                               appointment
     */
    Appointment updateAppointment(String id, String userId, AppointmentRequest request);

    /**
     * Delete an appointment
     * 
     * @param id     The appointment ID
     * @param userId The user's ID (for ownership verification)
     * @throws com.healthtracker.exception.ResourceNotFoundException if appointment
     *                                                               not found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the
     *                                                               appointment
     */
    void deleteAppointment(String id, String userId);
}
