package com.healthtracker.controller;

import com.healthtracker.dto.request.MedicineRequest;
import com.healthtracker.dto.response.MedicineResponse;
import com.healthtracker.mapper.MedicineMapper;
import com.healthtracker.model.Medicine;
import com.healthtracker.service.MedicineService;
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
 * Controller for medicines endpoints
 *
 * SECURITY: Returns DTOs instead of entities to prevent information leakage (userId NOT exposed)
 */
@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;
    private final MedicineMapper medicineMapper;

    /**
     * Get all medicines for authenticated user
     *
     * @return List of MedicineResponse DTOs (userId NOT exposed)
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<MedicineResponse>> getAllMedicines(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<Medicine> medicines = medicineService.getAllMedicines(userId);
        List<MedicineResponse> responses = medicineMapper.toResponseList(medicines);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get active medicines
     *
     * @return List of MedicineResponse DTOs (userId NOT exposed)
     */
    @GetMapping("/active")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<MedicineResponse>> getActiveMedicines(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<Medicine> medicines = medicineService.getActiveMedicines(userId);
        List<MedicineResponse> responses = medicineMapper.toResponseList(medicines);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get medicine by ID
     *
     * @return MedicineResponse DTO (userId NOT exposed)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<MedicineResponse> getMedicineById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Medicine medicine = medicineService.getMedicineById(id, userId);
        MedicineResponse response = medicineMapper.toResponse(medicine);
        return ResponseEntity.ok(response);
    }

    /**
     * Add new medicine
     *
     * @return MedicineResponse DTO (userId NOT exposed)
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<MedicineResponse> addMedicine(
            @Valid @RequestBody MedicineRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Medicine medicine = medicineService.addMedicine(userId, request);
        MedicineResponse response = medicineMapper.toResponse(medicine);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update medicine
     *
     * @return MedicineResponse DTO (userId NOT exposed)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<MedicineResponse> updateMedicine(
            @PathVariable String id,
            @Valid @RequestBody MedicineRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Medicine medicine = medicineService.updateMedicine(id, userId, request);
        MedicineResponse response = medicineMapper.toResponse(medicine);
        return ResponseEntity.ok(response);
    }

    /**
     * Deactivate medicine
     *
     * @return MedicineResponse DTO (userId NOT exposed)
     */
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<MedicineResponse> deactivateMedicine(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Medicine medicine = medicineService.deactivateMedicine(id, userId);
        MedicineResponse response = medicineMapper.toResponse(medicine);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete medicine
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Void> deleteMedicine(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        medicineService.deleteMedicine(id, userId);
        return ResponseEntity.noContent().build();
    }
}
