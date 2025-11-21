package com.healthtracker.repository;

import com.healthtracker.model.SymptomDiseaseMapping;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for SymptomDiseaseMapping entity (Reference data for DSS)
 * 
 * CRITICAL: This repository is key to symptom analysis performance
 */
@Repository
public interface SymptomDiseaseMappingRepository extends MongoRepository<SymptomDiseaseMapping, String> {
    
    /**
     * Find disease mappings that contain any of the given symptom names
     * 
     * PERFORMANCE OPTIMIZATION: Uses MongoDB $elemMatch with $in operator
     * This queries ONLY relevant disease mappings instead of loading all diseases
     * 
     * Performance impact: 10-100x faster than findAll() for large datasets
     * 
     * Example: If user has symptoms ["Đau đầu", "Buồn nôn"], this returns only
     * diseases that have these symptoms in their patterns, not all 1000+ diseases
     * 
     * @param symptomNames List of symptom names to search for
     * @return List of disease mappings that match any of the symptoms
     */
    @Query("{ 'symptomPatterns': { $elemMatch: { 'symptomName': { $in: ?0 } } } }")
    List<SymptomDiseaseMapping> findBySymptomNames(List<String> symptomNames);
    
    /**
     * Find disease mappings by category
     */
    List<SymptomDiseaseMapping> findByCategory(String category);
    
    /**
     * Find disease mappings by severity
     */
    List<SymptomDiseaseMapping> findBySeverity(String severity);
    
    /**
     * Find disease mappings that require immediate attention
     */
    List<SymptomDiseaseMapping> findByRequiresImmediateAttention(Boolean requiresImmediateAttention);
    
    /**
     * Find disease mapping by disease name
     */
    List<SymptomDiseaseMapping> findByDiseaseName(String diseaseName);
}

