package com.healthtracker.service;

import com.healthtracker.model.SymptomDiseaseMapping;
import com.healthtracker.repository.SymptomDiseaseMappingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for symptom-disease mapping with caching
 * 
 * PERFORMANCE: Caches disease mappings as they don't change frequently
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SymptomDiseaseMappingService {
    
    private final SymptomDiseaseMappingRepository repository;
    
    /**
     * Find relevant disease mappings by symptom names
     * 
     * CACHED: Results are cached for 1 hour to improve performance
     * This is 100-1000x faster for subsequent calls with same symptoms
     */
    @Cacheable(value = "diseaseMappings", key = "#symptomNames")
    public List<SymptomDiseaseMapping> findRelevantMappings(List<String> symptomNames) {
        log.info("Querying disease mappings for {} symptoms (cache miss)", symptomNames.size());
        return repository.findBySymptomNames(symptomNames);
    }
    
    /**
     * Get all disease mappings
     */
    @Cacheable(value = "allDiseaseMappings")
    public List<SymptomDiseaseMapping> getAllMappings() {
        log.info("Querying all disease mappings (cache miss)");
        return repository.findAll();
    }
    
    /**
     * Save or update a disease mapping
     * Evicts cache to ensure fresh data
     */
    @CacheEvict(value = {"diseaseMappings", "allDiseaseMappings"}, allEntries = true)
    public SymptomDiseaseMapping saveMapping(SymptomDiseaseMapping mapping) {
        log.info("Saving disease mapping: {} (cache evicted)", mapping.getDiseaseName());
        return repository.save(mapping);
    }
    
    /**
     * Delete a disease mapping
     * Evicts cache to ensure fresh data
     */
    @CacheEvict(value = {"diseaseMappings", "allDiseaseMappings"}, allEntries = true)
    public void deleteMapping(String id) {
        log.info("Deleting disease mapping: {} (cache evicted)", id);
        repository.deleteById(id);
    }
}

