package com.healthtracker.controller;

import com.healthtracker.dto.response.SymptomAnalysisResponse;
import com.healthtracker.model.HealthInsight;
import com.healthtracker.model.HealthPrediction;
import com.healthtracker.repository.HealthInsightRepository;
import com.healthtracker.repository.HealthPredictionRepository;
import com.healthtracker.service.dss.RiskPredictionService;
import com.healthtracker.service.dss.SymptomAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * DSS Controller - Decision Support System endpoints
 * 
 * CRITICAL: All endpoints verify userId matches authenticated user (IDOR prevention)
 */
@RestController
@RequestMapping("/api/dss")
@RequiredArgsConstructor
@Slf4j
public class DSSController {
    
    private final SymptomAnalysisService symptomAnalysisService;
    private final RiskPredictionService riskPredictionService;
    private final HealthInsightRepository insightRepository;
    private final HealthPredictionRepository predictionRepository;
    
    /**
     * Analyze user's symptoms and predict possible conditions
     * 
     * This is the CORE DSS endpoint!
     */
    @PostMapping("/analyze-symptoms")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<SymptomAnalysisResponse> analyzeSymptoms(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        log.info("Symptom analysis requested by user: {}", userId);
        
        SymptomAnalysisResponse response = symptomAnalysisService.analyzeSymptoms(userId);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Predict health risks (cardiovascular, diabetes, etc.)
     */
    @PostMapping("/predict-risks")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<HealthPrediction>> predictRisks(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        log.info("Risk prediction requested by user: {}", userId);
        
        List<HealthPrediction> predictions = riskPredictionService.predictHealthRisks(userId);
        
        return ResponseEntity.ok(predictions);
    }
    
    /**
     * Get all health insights for user
     */
    @GetMapping("/insights")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<HealthInsight>> getInsights(
            @RequestParam(required = false, defaultValue = "false") Boolean unreadOnly,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        
        List<HealthInsight> insights;
        if (unreadOnly) {
            insights = insightRepository.findByUserIdAndIsRead(userId, false);
        } else {
            insights = insightRepository.findByUserIdOrderByGeneratedAtDesc(userId);
        }
        
        return ResponseEntity.ok(insights);
    }
    
    /**
     * Get unread insights count
     */
    @GetMapping("/insights/unread-count")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Map<String, Long>> getUnreadInsightsCount(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        
        long count = insightRepository.findByUserIdAndIsRead(userId, false).size();
        
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", count);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Mark insight as read
     */
    @PutMapping("/insights/{id}/read")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<HealthInsight> markInsightAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        
        HealthInsight insight = insightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insight not found"));
        
        // CRITICAL: Verify ownership (IDOR prevention)
        if (!insight.getUserId().equals(userId)) {
            log.warn("IDOR attempt detected: user {} tried to access insight of user {}", 
                    userId, insight.getUserId());
            return ResponseEntity.status(403).build();
        }
        
        insight.setIsRead(true);
        insightRepository.save(insight);
        
        return ResponseEntity.ok(insight);
    }
    
    /**
     * Get all predictions for user
     */
    @GetMapping("/predictions")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<HealthPrediction>> getPredictions(
            @RequestParam(required = false, defaultValue = "false") Boolean validOnly,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        
        List<HealthPrediction> predictions;
        if (validOnly) {
            predictions = predictionRepository.findByUserIdAndValidUntilAfter(
                    userId, LocalDateTime.now());
        } else {
            predictions = predictionRepository.findByUserIdOrderByPredictedAtDesc(userId);
        }
        
        return ResponseEntity.ok(predictions);
    }
    
    /**
     * Get comprehensive DSS dashboard data
     * 
     * Returns:
     * - Recent insights (top 5)
     * - Active predictions
     * - Symptom analysis summary
     * - Risk scores
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Map<String, Object>> getDSSDashboard(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        log.info("DSS dashboard requested by user: {}", userId);
        
        // Get recent insights
        List<HealthInsight> recentInsights = insightRepository
                .findByUserIdAndExpiresAtAfterOrderByPriorityAsc(userId, LocalDateTime.now())
                .stream()
                .limit(5)
                .toList();
        
        // Get active predictions
        List<HealthPrediction> activePredictions = predictionRepository
                .findByUserIdAndValidUntilAfter(userId, LocalDateTime.now());
        
        // Build dashboard
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("recentInsights", recentInsights);
        dashboard.put("activePredictions", activePredictions);
        dashboard.put("unreadInsightsCount", 
                insightRepository.findByUserIdAndIsRead(userId, false).size());
        dashboard.put("lastUpdated", LocalDateTime.now());
        
        return ResponseEntity.ok(dashboard);
    }
    
    /**
     * Delete expired insights (cleanup)
     */
    @DeleteMapping("/insights/cleanup")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Map<String, String>> cleanupExpiredInsights() {
        insightRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        predictionRepository.deleteByValidUntilBefore(LocalDateTime.now());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cleanup completed successfully");
        
        return ResponseEntity.ok(response);
    }
}

