package com.healthtracker.service;

import com.healthtracker.dto.request.SymptomRequest;
import com.healthtracker.model.Symptom;

import java.util.List;

/**
 * Interface for symptoms operations
 * 
 * Provides contract for managing user symptoms including CRUD operations
 * and active symptom tracking for DSS analysis.
 */
public interface ISymptomService {

    /**
     * Get all symptoms for a user, ordered by start date descending
     * 
     * @param userId The user's ID
     * @return List of all symptoms for the user
     */
    List<Symptom> getAllSymptoms(String userId);

    /**
     * Get active symptoms (symptoms without end date)
     * 
     * @param userId The user's ID
     * @return List of active symptoms that haven't ended
     */
    List<Symptom> getActiveSymptoms(String userId);

    /**
     * Get a specific symptom by ID
     * 
     * @param id     The symptom ID
     * @param userId The user's ID (for ownership verification)
     * @return The symptom
     * @throws com.healthtracker.exception.ResourceNotFoundException if symptom not
     *                                                               found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the symptom
     */
    Symptom getSymptomById(String id, String userId);

    /**
     * Add a new symptom
     * 
     * @param userId  The user's ID
     * @param request The symptom data
     * @return The created symptom
     */
    Symptom addSymptom(String userId, SymptomRequest request);

    /**
     * Update an existing symptom
     * 
     * @param id      The symptom ID
     * @param userId  The user's ID (for ownership verification)
     * @param request The updated symptom data
     * @return The updated symptom
     * @throws com.healthtracker.exception.ResourceNotFoundException if symptom not
     *                                                               found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the symptom
     */
    Symptom updateSymptom(String id, String userId, SymptomRequest request);

    /**
     * End a symptom by setting its end date to now
     * 
     * @param id     The symptom ID
     * @param userId The user's ID (for ownership verification)
     * @return The updated symptom with end date set
     * @throws com.healthtracker.exception.ResourceNotFoundException if symptom not
     *                                                               found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the symptom
     */
    Symptom endSymptom(String id, String userId);

    /**
     * Delete a symptom
     * 
     * @param id     The symptom ID
     * @param userId The user's ID (for ownership verification)
     * @throws com.healthtracker.exception.ResourceNotFoundException if symptom not
     *                                                               found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the symptom
     */
    void deleteSymptom(String id, String userId);
}
