package com.healthtracker.service.dss;

import com.healthtracker.dto.response.SymptomAnalysisResponse;

/**
 * Interface for DSS Symptom Analysis Service
 * 
 * CORE DSS SERVICE - Provides contract for analyzing user symptoms
 * and predicting possible health conditions using a sophisticated
 * matching algorithm.
 * 
 * ALGORITHM OVERVIEW:
 * 1. Get active symptoms (endDate = null)
 * 2. Extract symptom names
 * 3. Query relevant disease mappings (performance optimized)
 * 4. Pre-index symptoms in Set for O(1) lookup
 * 5. Calculate match scores for each disease
 * 6. Rank diseases by score (top 5)
 * 7. Calculate urgency score (0-100)
 * 8. Generate and save health insights
 * 9. Return analysis response
 */
public interface ISymptomAnalysisService {

    /**
     * Analyze user's active symptoms and predict possible health conditions
     * 
     * This method performs a comprehensive analysis of the user's active symptoms:
     * - Matches symptoms against disease patterns in the database
     * - Calculates match scores using weighted symptom patterns
     * - Determines urgency level based on severity, duration, and critical
     * indicators
     * - Generates actionable health insights
     * 
     * @param userId The user's ID
     * @return SymptomAnalysisResponse containing:
     *         - List of possible conditions ranked by match score
     *         - Urgency score (0-100) and level (LOW/MODERATE/HIGH)
     *         - Recommendations and actionable advice
     *         - Analysis notes
     */
    SymptomAnalysisResponse analyzeSymptoms(String userId);
}
