package com.healthtracker.controller;

import com.healthtracker.dto.request.SymptomRequest;
import com.healthtracker.dto.response.SymptomResponse;
import com.healthtracker.mapper.SymptomMapper;
import com.healthtracker.model.Symptom;
import com.healthtracker.service.ISymptomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for symptoms endpoints
 *
 * SECURITY: Returns DTOs instead of entities to prevent information leakage
 * (userId NOT exposed)
 */
@RestController
@RequestMapping("/api/symptoms")
@RequiredArgsConstructor
public class SymptomController {

    private final ISymptomService symptomService;
    private final SymptomMapper symptomMapper;

    /**
     * Get all symptoms for authenticated user
     *
     * @return List of SymptomResponse DTOs (userId NOT exposed)
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<SymptomResponse>> getAllSymptoms(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<Symptom> symptoms = symptomService.getAllSymptoms(userId);
        List<SymptomResponse> responses = symptomMapper.toResponseList(symptoms);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get active symptoms
     *
     * @return List of SymptomResponse DTOs (userId NOT exposed)
     */
    @GetMapping("/active")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<SymptomResponse>> getActiveSymptoms(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<Symptom> symptoms = symptomService.getActiveSymptoms(userId);
        List<SymptomResponse> responses = symptomMapper.toResponseList(symptoms);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get symptom by ID
     *
     * @return SymptomResponse DTO (userId NOT exposed)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<SymptomResponse> getSymptomById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        Symptom symptom = symptomService.getSymptomById(id, userId);
        SymptomResponse response = symptomMapper.toResponse(symptom);
        return ResponseEntity.ok(response);
    }

    /**
     * Add new symptom
     *
     * @return SymptomResponse DTO (userId NOT exposed)
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<SymptomResponse> addSymptom(
            @Valid @RequestBody SymptomRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        Symptom symptom = symptomService.addSymptom(userId, request);
        SymptomResponse response = symptomMapper.toResponse(symptom);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update symptom
     *
     * @return SymptomResponse DTO (userId NOT exposed)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<SymptomResponse> updateSymptom(
            @PathVariable String id,
            @Valid @RequestBody SymptomRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        Symptom symptom = symptomService.updateSymptom(id, userId, request);
        SymptomResponse response = symptomMapper.toResponse(symptom);
        return ResponseEntity.ok(response);
    }

    /**
     * End symptom
     *
     * @return SymptomResponse DTO (userId NOT exposed)
     */
    @PutMapping("/{id}/end")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<SymptomResponse> endSymptom(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        Symptom symptom = symptomService.endSymptom(id, userId);
        SymptomResponse response = symptomMapper.toResponse(symptom);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete symptom
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Void> deleteSymptom(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        symptomService.deleteSymptom(id, userId);
        return ResponseEntity.noContent().build();
    }
}
