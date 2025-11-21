package com.healthtracker.service;

import com.healthtracker.dto.request.MedicineRequest;
import com.healthtracker.exception.BadRequestException;
import com.healthtracker.exception.ResourceNotFoundException;
import com.healthtracker.model.Medicine;
import com.healthtracker.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicineService {
    
    private final MedicineRepository medicineRepository;
    
    public List<Medicine> getAllMedicines(String userId) {
        return medicineRepository.findByUserIdOrderByMedicineNameAsc(userId);
    }
    
    public List<Medicine> getActiveMedicines(String userId) {
        return medicineRepository.findByUserIdAndIsActive(userId, true);
    }
    
    public Medicine getMedicineById(String id, String userId) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", "id", id));
        
        if (!medicine.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to access this medicine");
        }
        
        return medicine;
    }
    
    public Medicine addMedicine(String userId, MedicineRequest request) {
        log.info("Adding new medicine for user: {}", userId);
        
        Medicine medicine = Medicine.builder()
                .userId(userId)
                .medicineName(request.getMedicineName())
                .medicineType(request.getMedicineType())
                .dosage(request.getDosage())
                .schedules(request.getSchedules())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .purpose(request.getPurpose())
                .logs(new ArrayList<>())
                .missedDoses(0)
                .adherenceRate(100.0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        
        return medicineRepository.save(medicine);
    }
    
    public Medicine updateMedicine(String id, String userId, MedicineRequest request) {
        Medicine medicine = getMedicineById(id, userId);
        
        log.info("Updating medicine: {} for user: {}", id, userId);
        
        medicine.setMedicineName(request.getMedicineName());
        medicine.setMedicineType(request.getMedicineType());
        medicine.setDosage(request.getDosage());
        medicine.setSchedules(request.getSchedules());
        medicine.setStartDate(request.getStartDate());
        medicine.setEndDate(request.getEndDate());
        medicine.setPurpose(request.getPurpose());
        
        if (request.getIsActive() != null) {
            medicine.setIsActive(request.getIsActive());
        }
        
        return medicineRepository.save(medicine);
    }
    
    public Medicine deactivateMedicine(String id, String userId) {
        Medicine medicine = getMedicineById(id, userId);
        log.info("Deactivating medicine: {} for user: {}", id, userId);
        medicine.setIsActive(false);
        return medicineRepository.save(medicine);
    }
    
    public void deleteMedicine(String id, String userId) {
        Medicine medicine = getMedicineById(id, userId);
        log.info("Deleting medicine: {} for user: {}", id, userId);
        medicineRepository.delete(medicine);
    }
}

