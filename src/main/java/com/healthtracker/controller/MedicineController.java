package com.healthtracker.controller;

import com.healthtracker.dto.request.MedicineRequest;
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

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {
    
    private final MedicineService medicineService;
    
    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<Medicine>> getAllMedicines(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<Medicine> medicines = medicineService.getAllMedicines(userId);
        return ResponseEntity.ok(medicines);
    }
    
    @GetMapping("/active")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<Medicine>> getActiveMedicines(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        List<Medicine> medicines = medicineService.getActiveMedicines(userId);
        return ResponseEntity.ok(medicines);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Medicine> getMedicineById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Medicine medicine = medicineService.getMedicineById(id, userId);
        return ResponseEntity.ok(medicine);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Medicine> addMedicine(
            @Valid @RequestBody MedicineRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Medicine medicine = medicineService.addMedicine(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(medicine);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Medicine> updateMedicine(
            @PathVariable String id,
            @Valid @RequestBody MedicineRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Medicine medicine = medicineService.updateMedicine(id, userId, request);
        return ResponseEntity.ok(medicine);
    }
    
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Medicine> deactivateMedicine(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        Medicine medicine = medicineService.deactivateMedicine(id, userId);
        return ResponseEntity.ok(medicine);
    }
    
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

