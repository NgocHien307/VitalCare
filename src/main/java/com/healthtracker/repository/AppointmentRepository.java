package com.healthtracker.repository;

import com.healthtracker.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Appointment entity
 */
@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    /**
     * Find all appointments for a user
     */
    List<Appointment> findByUserId(String userId);

    /**
     * Find upcoming appointments (after current date)
     */
    List<Appointment> findByUserIdAndAppointmentDateAfter(String userId, LocalDateTime after);

    /**
     * Find appointments by user and date range
     */
    List<Appointment> findByUserIdAndAppointmentDateBetween(
            String userId,
            LocalDateTime start,
            LocalDateTime end);

    /**
     * Find appointments by user and status
     */
    List<Appointment> findByUserIdAndStatus(String userId, String status);

    /**
     * Find appointments ordered by date
     */
    List<Appointment> findByUserIdOrderByAppointmentDateAsc(String userId);

    /**
     * Delete appointments by user ID
     */
    void deleteByUserId(String userId);
}
