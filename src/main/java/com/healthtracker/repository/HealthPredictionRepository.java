package com.healthtracker.repository;

import com.healthtracker.model.HealthPrediction;
import com.healthtracker.model.PredictionType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for HealthPrediction entity (DSS output)
 */
@Repository
public interface HealthPredictionRepository extends MongoRepository<HealthPrediction, String> {
    
    /**
     * Find all predictions for a user
     */
    List<HealthPrediction> findByUserId(String userId);
    
    /**
     * Find valid predictions for a user (not expired)
     */
    List<HealthPrediction> findByUserIdAndValidUntilAfter(String userId, LocalDateTime now);
    
    /**
     * Find predictions by user and type
     */
    List<HealthPrediction> findByUserIdAndPredictionType(String userId, PredictionType type);
    
    /**
     * Find predictions by user and target condition
     */
    List<HealthPrediction> findByUserIdAndTargetCondition(String userId, String targetCondition);
    
    /**
     * Find latest prediction by user and target condition
     */
    Optional<HealthPrediction> findFirstByUserIdAndTargetConditionOrderByPredictedAtDesc(
        String userId, 
        String targetCondition
    );
    
    /**
     * Find predictions by user, ordered by predicted date (newest first)
     */
    List<HealthPrediction> findByUserIdOrderByPredictedAtDesc(String userId);
    
    /**
     * Delete predictions by user ID
     */
    void deleteByUserId(String userId);
    
    /**
     * Delete expired predictions
     */
    void deleteByValidUntilBefore(LocalDateTime now);
}

