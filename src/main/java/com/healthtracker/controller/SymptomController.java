package com.healthtracker.controller;

import com.healthtracker.dto.request.SymptomRequest;
import com.healthtracker.model.Symptom;
import com.healthtracker.service.SymptomService;
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
 */
@RestController
@RequestMapping("/api/symptoms")
@RequiredArgsConstructor
public class SymptomController {
    
    private final SymptomService symptomService;
    
    /**
     * Get all symptoms for authenticated user
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<Symptom>> getAllSymptoms(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<Symptom> symptoms = symptomService.getAllSymptoms(userId);
        return ResponseEntity.ok(symptoms);
    }
    
    /**
     * Get active symptoms
     */
    @GetMapping("/active")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<Symptom>> getActiveSymptoms(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<Symptom> symptoms = symptomService.getActiveSymptoms(userId);
        return ResponseEntity.ok(symptoms);
    }
    
    /**
     * Get symptom by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Symptom> getSymptomById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Symptom symptom = symptomService.getSymptomById(id, userId);
        return ResponseEntity.ok(symptom);
    }
    
    /**
     * Add new symptom
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Symptom> addSymptom(
            @Valid @RequestBody SymptomRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Symptom symptom = symptomService.addSymptom(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(symptom);
    }
    
    /**
     * Update symptom
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Symptom> updateSymptom(
            @PathVariable String id,
            @Valid @RequestBody SymptomRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Symptom symptom = symptomService.updateSymptom(id, userId, request);
        return ResponseEntity.ok(symptom);
    }
    
    /**
     * End symptom
     */
    @PutMapping("/{id}/end")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Symptom> endSymptom(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Symptom symptom = symptomService.endSymptom(id, userId);
        return ResponseEntity.ok(symptom);
    }
    
    /**
     * Delete symptom
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Void> deleteSymptom(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        symptomService.deleteSymptom(id, userId);
        return ResponseEntity.noContent().build();
    }
}

