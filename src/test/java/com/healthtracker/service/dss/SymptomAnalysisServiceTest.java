package com.healthtracker.service.dss;

import com.healthtracker.dto.response.DiseaseMatchScore;
import com.healthtracker.dto.response.SymptomAnalysisResponse;
import com.healthtracker.model.Symptom;
import com.healthtracker.model.SymptomDiseaseMapping;
import com.healthtracker.model.SymptomPattern;
import com.healthtracker.repository.HealthInsightRepository;
import com.healthtracker.repository.SymptomRepository;
import com.healthtracker.service.SymptomDiseaseMappingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

/**
 * Unit tests for SymptomAnalysisService
 * Testing the CORE DSS functionality
 */
@ExtendWith(MockitoExtension.class)
class SymptomAnalysisServiceTest {
    
    @Mock
    private SymptomRepository symptomRepository;
    
    @Mock
    private SymptomDiseaseMappingService mappingService;
    
    @Mock
    private HealthInsightRepository insightRepository;
    
    @InjectMocks
    private SymptomAnalysisService symptomAnalysisService;
    
    private String userId;
    
    @BeforeEach
    void setUp() {
        userId = "test@example.com";
    }
    
    @Test
    @DisplayName("Should return no symptoms response when user has no active symptoms")
    void testAnalyzeSymptoms_NoActiveSymptoms() {
        // Given
        when(symptomRepository.findByUserIdAndEndDateIsNull(userId))
                .thenReturn(Collections.emptyList());
        
        // When
        SymptomAnalysisResponse response = symptomAnalysisService.analyzeSymptoms(userId);
        
        // Then
        assertNotNull(response);
        assertEquals(0, response.getPossibleConditions().size());
        assertEquals(0.0, response.getUrgencyScore());
        assertEquals("NONE", response.getUrgencyLevel());
        
        verify(symptomRepository).findByUserIdAndEndDateIsNull(userId);
        verifyNoInteractions(mappingService);
    }
    
    @Test
    @DisplayName("Should analyze symptoms and return possible conditions")
    void testAnalyzeSymptoms_WithSymptoms() {
        // Given
        List<Symptom> symptoms = Arrays.asList(
                createSymptom("Đau đầu", 8, LocalDateTime.now().minusDays(2)),
                createSymptom("Buồn nôn", 5, LocalDateTime.now().minusDays(1))
        );
        
        List<SymptomDiseaseMapping> mappings = Arrays.asList(
                createMigraineMapping()
        );
        
        when(symptomRepository.findByUserIdAndEndDateIsNull(userId))
                .thenReturn(symptoms);
        when(mappingService.findRelevantMappings(anyList()))
                .thenReturn(mappings);
        when(insightRepository.save(any()))
                .thenReturn(null);
        
        // When
        SymptomAnalysisResponse response = symptomAnalysisService.analyzeSymptoms(userId);
        
        // Then
        assertNotNull(response);
        assertTrue(response.getPossibleConditions().size() > 0);
        assertTrue(response.getUrgencyScore() > 0);
        assertNotNull(response.getUrgencyLevel());
        
        verify(symptomRepository).findByUserIdAndEndDateIsNull(userId);
        verify(mappingService).findRelevantMappings(anyList());
    }
    
    @Test
    @DisplayName("Should calculate high urgency for severe symptoms")
    void testAnalyzeSymptoms_HighUrgency() {
        // Given - severe symptoms
        List<Symptom> symptoms = Arrays.asList(
                createSymptom("Đau ngực", 9, LocalDateTime.now()),
                createSymptom("Khó thở", 8, LocalDateTime.now()),
                createSymptom("Chóng mặt", 7, LocalDateTime.now())
        );
        
        SymptomDiseaseMapping criticalMapping = createCriticalDiseaseMapping();
        
        when(symptomRepository.findByUserIdAndEndDateIsNull(userId))
                .thenReturn(symptoms);
        when(mappingService.findRelevantMappings(anyList()))
                .thenReturn(Arrays.asList(criticalMapping));
        when(insightRepository.save(any()))
                .thenReturn(null);
        
        // When
        SymptomAnalysisResponse response = symptomAnalysisService.analyzeSymptoms(userId);
        
        // Then
        assertNotNull(response);
        assertTrue(response.getUrgencyScore() > 70, 
                "Urgency score should be > 70 for severe symptoms");
        assertEquals("HIGH", response.getUrgencyLevel());
    }
    
    // Helper methods
    private Symptom createSymptom(String name, int severity, LocalDateTime startDate) {
        Symptom symptom = new Symptom();
        symptom.setSymptomName(name);
        symptom.setSeverity(severity);
        symptom.setStartDate(startDate);
        symptom.setBodyPart("Test");
        return symptom;
    }
    
    private SymptomDiseaseMapping createMigraineMapping() {
        SymptomDiseaseMapping mapping = new SymptomDiseaseMapping();
        mapping.setDiseaseName("Đau nửa đầu");
        mapping.setDiseaseNameEn("Migraine");
        mapping.setIcdCode("G43");
        mapping.setSeverity("MODERATE");
        mapping.setCategory("NEUROLOGICAL");
        mapping.setRequiresImmediateAttention(false);
        
        List<SymptomPattern> patterns = Arrays.asList(
                createPattern("Đau đầu", 30, true),
                createPattern("Buồn nôn", 15, false)
        );
        mapping.setSymptomPatterns(patterns);
        
        return mapping;
    }
    
    private SymptomDiseaseMapping createCriticalDiseaseMapping() {
        SymptomDiseaseMapping mapping = new SymptomDiseaseMapping();
        mapping.setDiseaseName("Nhồi máu cơ tim");
        mapping.setDiseaseNameEn("Myocardial Infarction");
        mapping.setIcdCode("I21");
        mapping.setSeverity("CRITICAL");
        mapping.setCategory("CARDIOVASCULAR");
        mapping.setRequiresImmediateAttention(true);
        
        List<SymptomPattern> patterns = Arrays.asList(
                createPattern("Đau ngực", 40, true),
                createPattern("Khó thở", 25, true),
                createPattern("Chóng mặt", 15, false)
        );
        mapping.setSymptomPatterns(patterns);
        
        return mapping;
    }
    
    private SymptomPattern createPattern(String name, int weight, boolean critical) {
        SymptomPattern pattern = new SymptomPattern();
        pattern.setSymptomName(name);
        pattern.setWeight(weight);
        pattern.setIsCritical(critical);
        return pattern;
    }
}

