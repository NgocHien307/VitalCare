package com.healthtracker.repository;

import com.healthtracker.model.HealthInsight;
import com.healthtracker.model.InsightType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for HealthInsight entity (DSS output)
 */
@Repository
public interface HealthInsightRepository extends MongoRepository<HealthInsight, String> {
    
    /**
     * Find all insights for a user
     */
    List<HealthInsight> findByUserId(String userId);
    
    /**
     * Find unread insights for a user
     */
    List<HealthInsight> findByUserIdAndIsRead(String userId, Boolean isRead);
    
    /**
     * Find insights by user and type
     */
    List<HealthInsight> findByUserIdAndType(String userId, InsightType type);
    
    /**
     * Find insights by user and severity
     */
    List<HealthInsight> findByUserIdAndSeverity(String userId, String severity);
    
    /**
     * Find insights by user, not expired, ordered by priority
     */
    List<HealthInsight> findByUserIdAndExpiresAtAfterOrderByPriorityAsc(
        String userId, 
        LocalDateTime now
    );
    
    /**
     * Find insights by user, ordered by generated date (newest first)
     */
    List<HealthInsight> findByUserIdOrderByGeneratedAtDesc(String userId);
    
    /**
     * Delete insights by user ID
     */
    void deleteByUserId(String userId);
    
    /**
     * Delete expired insights
     */
    void deleteByExpiresAtBefore(LocalDateTime now);
}

