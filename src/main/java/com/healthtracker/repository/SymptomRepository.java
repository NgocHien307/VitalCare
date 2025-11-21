package com.healthtracker.repository;

import com.healthtracker.model.Symptom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Symptom entity
 */
@Repository
public interface SymptomRepository extends MongoRepository<Symptom, String> {
    
    /**
     * Find all symptoms for a user
     */
    List<Symptom> findByUserId(String userId);
    
    /**
     * Find active symptoms (endDate is null) - CRITICAL for symptom analysis
     */
    List<Symptom> findByUserIdAndEndDateIsNull(String userId);
    
    /**
     * Find symptoms by user and date range
     */
    List<Symptom> findByUserIdAndStartDateBetween(String userId, LocalDateTime start, LocalDateTime end);
    
    /**
     * Find symptoms by user ordered by start date
     */
    List<Symptom> findByUserIdOrderByStartDateDesc(String userId);
    
    /**
     * Find symptoms by user and severity greater than threshold
     */
    List<Symptom> findByUserIdAndSeverityGreaterThanEqual(String userId, Integer severity);
    
    /**
     * Delete symptoms by user ID
     */
    void deleteByUserId(String userId);
}

