package com.healthtracker.service;

import com.healthtracker.dto.request.SymptomRequest;
import com.healthtracker.exception.BadRequestException;
import com.healthtracker.exception.ResourceNotFoundException;
import com.healthtracker.model.Symptom;
import com.healthtracker.repository.SymptomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of symptoms operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SymptomService implements ISymptomService {

    private final SymptomRepository symptomRepository;

    /**
     * Get all symptoms for a user
     */
    @Override
    public List<Symptom> getAllSymptoms(String userId) {
        return symptomRepository.findByUserIdOrderByStartDateDesc(userId);
    }

    /**
     * Get active symptoms (endDate is null)
     */
    @Override
    public List<Symptom> getActiveSymptoms(String userId) {
        return symptomRepository.findByUserIdAndEndDateIsNull(userId);
    }

    /**
     * Get a specific symptom by ID
     */
    @Override
    public Symptom getSymptomById(String id, String userId) {
        Symptom symptom = symptomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Symptom", "id", id));

        // Verify ownership
        if (!symptom.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to access this symptom");
        }

        return symptom;
    }

    /**
     * Add a new symptom
     */
    @Override
    public Symptom addSymptom(String userId, SymptomRequest request) {
        log.info("Adding new symptom for user: {}", userId);

        Symptom symptom = Symptom.builder()
                .userId(userId)
                .symptomName(request.getSymptomName())
                .bodyPart(request.getBodyPart())
                .severity(request.getSeverity())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .frequency(request.getFrequency())
                .triggers(request.getTriggers())
                .description(request.getDescription())
                .relatedSymptoms(request.getRelatedSymptoms())
                .build();

        return symptomRepository.save(symptom);
    }

    /**
     * Update an existing symptom
     */
    @Override
    public Symptom updateSymptom(String id, String userId, SymptomRequest request) {
        Symptom symptom = getSymptomById(id, userId);

        log.info("Updating symptom: {} for user: {}", id, userId);

        symptom.setSymptomName(request.getSymptomName());
        symptom.setBodyPart(request.getBodyPart());
        symptom.setSeverity(request.getSeverity());
        symptom.setStartDate(request.getStartDate());
        symptom.setEndDate(request.getEndDate());
        symptom.setFrequency(request.getFrequency());
        symptom.setTriggers(request.getTriggers());
        symptom.setDescription(request.getDescription());
        symptom.setRelatedSymptoms(request.getRelatedSymptoms());

        return symptomRepository.save(symptom);
    }

    /**
     * End a symptom (set endDate to now)
     */
    @Override
    public Symptom endSymptom(String id, String userId) {
        Symptom symptom = getSymptomById(id, userId);

        log.info("Ending symptom: {} for user: {}", id, userId);

        symptom.setEndDate(LocalDateTime.now());
        return symptomRepository.save(symptom);
    }

    /**
     * Delete a symptom
     */
    @Override
    public void deleteSymptom(String id, String userId) {
        Symptom symptom = getSymptomById(id, userId);
        log.info("Deleting symptom: {} for user: {}", id, userId);
        symptomRepository.delete(symptom);
    }
}
