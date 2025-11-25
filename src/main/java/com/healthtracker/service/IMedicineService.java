package com.healthtracker.service;

import com.healthtracker.dto.request.MedicineRequest;
import com.healthtracker.model.Medicine;

import java.util.List;

/**
 * Interface for medicine management operations
 * 
 * Provides contract for managing user medications including CRUD operations,
 * active medicine tracking, and adherence monitoring.
 */
public interface IMedicineService {

    /**
     * Get all medicines for a user, ordered by name ascending
     * 
     * @param userId The user's ID
     * @return List of all medicines for the user
     */
    List<Medicine> getAllMedicines(String userId);

    /**
     * Get active medicines for a user
     * 
     * @param userId The user's ID
     * @return List of active medicines (isActive = true)
     */
    List<Medicine> getActiveMedicines(String userId);

    /**
     * Get a specific medicine by ID
     * 
     * @param id     The medicine ID
     * @param userId The user's ID (for ownership verification)
     * @return The medicine
     * @throws com.healthtracker.exception.ResourceNotFoundException if medicine not
     *                                                               found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the
     *                                                               medicine
     */
    Medicine getMedicineById(String id, String userId);

    /**
     * Add a new medicine
     * 
     * @param userId  The user's ID
     * @param request The medicine data
     * @return The created medicine
     */
    Medicine addMedicine(String userId, MedicineRequest request);

    /**
     * Update an existing medicine
     * 
     * @param id      The medicine ID
     * @param userId  The user's ID (for ownership verification)
     * @param request The updated medicine data
     * @return The updated medicine
     * @throws com.healthtracker.exception.ResourceNotFoundException if medicine not
     *                                                               found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the
     *                                                               medicine
     */
    Medicine updateMedicine(String id, String userId, MedicineRequest request);

    /**
     * Deactivate a medicine (soft delete)
     * 
     * @param id     The medicine ID
     * @param userId The user's ID (for ownership verification)
     * @return The deactivated medicine
     * @throws com.healthtracker.exception.ResourceNotFoundException if medicine not
     *                                                               found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the
     *                                                               medicine
     */
    Medicine deactivateMedicine(String id, String userId);

    /**
     * Delete a medicine permanently
     * 
     * @param id     The medicine ID
     * @param userId The user's ID (for ownership verification)
     * @throws com.healthtracker.exception.ResourceNotFoundException if medicine not
     *                                                               found
     * @throws com.healthtracker.exception.BadRequestException       if user doesn't
     *                                                               own the
     *                                                               medicine
     */
    void deleteMedicine(String id, String userId);
}
