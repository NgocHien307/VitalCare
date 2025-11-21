package com.healthtracker.repository;

import com.healthtracker.model.HealthProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for HealthProfile entity
 */
@Repository
public interface HealthProfileRepository extends MongoRepository<HealthProfile, String> {
    
    /**
     * Find health profile by user ID
     */
    Optional<HealthProfile> findByUserId(String userId);
    
    /**
     * Delete health profile by user ID
     */
    void deleteByUserId(String userId);
}

