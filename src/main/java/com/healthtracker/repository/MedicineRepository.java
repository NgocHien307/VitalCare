package com.healthtracker.repository;

import com.healthtracker.model.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Medicine entity
 */
@Repository
public interface MedicineRepository extends MongoRepository<Medicine, String> {
    
    /**
     * Find all medicines for a user
     */
    List<Medicine> findByUserId(String userId);
    
    /**
     * Find active medicines for a user
     */
    List<Medicine> findByUserIdAndIsActive(String userId, Boolean isActive);
    
    /**
     * Find medicines by user ordered by medicine name
     */
    List<Medicine> findByUserIdOrderByMedicineNameAsc(String userId);
    
    /**
     * Delete medicines by user ID
     */
    void deleteByUserId(String userId);
}

