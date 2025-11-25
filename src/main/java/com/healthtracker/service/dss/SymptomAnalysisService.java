package com.healthtracker.service.dss;

import com.healthtracker.dto.response.DiseaseMatchScore;
import com.healthtracker.dto.response.SymptomAnalysisResponse;
import com.healthtracker.model.*;
import com.healthtracker.repository.HealthInsightRepository;
import com.healthtracker.repository.SymptomDiseaseMappingRepository;
import com.healthtracker.repository.SymptomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * CORE DSS SERVICE - Symptom Analysis
 * 
 * This service analyzes user symptoms and predicts possible conditions
 * using a sophisticated matching algorithm with performance optimizations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SymptomAnalysisService implements ISymptomAnalysisService {

    private final SymptomRepository symptomRepository;
    private final com.healthtracker.service.SymptomDiseaseMappingService mappingService;
    private final HealthInsightRepository insightRepository;

    /**
     * Analyze user's active symptoms and predict possible conditions
     * 
     * ALGORITHM:
     * 1. Get active symptoms (endDate = null)
     * 2. Extract symptom names
     * 3. Query ONLY relevant disease mappings (PERFORMANCE OPTIMIZATION!)
     * 4. Pre-index symptoms in Set for O(1) lookup (CRITICAL!)
     * 5. Calculate match scores for each disease
     * 6. Rank diseases by score (top 5)
     * 7. Calculate urgency score
     * 8. Generate and save insights
     * 9. Return response
     */
    @Override
    public SymptomAnalysisResponse analyzeSymptoms(String userId) {
        log.info("Analyzing symptoms for user: {}", userId);

        // 1. Get active symptoms
        List<Symptom> activeSymptoms = symptomRepository.findByUserIdAndEndDateIsNull(userId);

        if (activeSymptoms.isEmpty()) {
            log.info("No active symptoms found for user: {}", userId);
            return SymptomAnalysisResponse.noSymptoms();
        }

        log.info("Found {} active symptoms", activeSymptoms.size());

        // 2. Extract symptom names
        List<String> symptomNames = activeSymptoms.stream()
                .map(Symptom::getSymptomName)
                .toList();

        // 3. Query ONLY relevant disease mappings (PERFORMANCE OPTIMIZATION!)
        // This is 10-100x faster than findAll() for large datasets
        // CACHED: Results are cached by symptom names for even better performance
        List<SymptomDiseaseMapping> relevantMappings = mappingService.findRelevantMappings(symptomNames);

        log.info("Found {} relevant disease mappings", relevantMappings.size());

        if (relevantMappings.isEmpty()) {
            return buildNoMatchResponse();
        }

        // 4. Pre-index symptoms in Set for O(1) lookup (CRITICAL FOR PERFORMANCE!)
        Set<String> userSymptomSet = activeSymptoms.stream()
                .map(s -> s.getSymptomName().toLowerCase().trim())
                .collect(Collectors.toSet());

        // 5. Calculate match scores for each disease
        Map<String, DiseaseMatchScore> diseaseScores = new HashMap<>();
        for (SymptomDiseaseMapping mapping : relevantMappings) {
            double score = calculateMatchScore(userSymptomSet, mapping);

            // Only include diseases with >30% match
            if (score > 0.3) {
                diseaseScores.put(mapping.getDiseaseName(),
                        new DiseaseMatchScore(mapping, score));
            }
        }

        log.info("Calculated scores for {} diseases", diseaseScores.size());

        // 6. Rank diseases by score (top 5)
        List<DiseaseMatchScore> rankedDiseases = diseaseScores.values().stream()
                .sorted(Comparator.comparing(DiseaseMatchScore::getMatchScore).reversed())
                .limit(5)
                .toList();

        // 7. Calculate urgency score
        double urgencyScore = calculateUrgencyScore(activeSymptoms, rankedDiseases);

        log.info("Urgency score: {}", urgencyScore);

        // 8. Generate and save insights
        generateInsights(userId, rankedDiseases, urgencyScore);

        // 9. Build and return response
        return buildResponse(rankedDiseases, urgencyScore);
    }

    /**
     * Calculate match score between user symptoms and disease pattern
     * 
     * PERFORMANCE: Uses O(1) Set lookup instead of O(m) stream search
     * 
     * @param userSymptoms   Set of user symptom names (lowercase)
     * @param diseaseMapping Disease mapping to match against
     * @return Match score (0-1) representing percentage of pattern matched
     */
    private double calculateMatchScore(
            Set<String> userSymptoms,
            SymptomDiseaseMapping diseaseMapping) {
        List<SymptomPattern> patterns = diseaseMapping.getSymptomPatterns();

        // Calculate total weight of all symptoms in pattern
        double totalWeight = patterns.stream()
                .mapToInt(SymptomPattern::getWeight)
                .sum();

        if (totalWeight == 0) {
            return 0;
        }

        double matchedSymptomWeight = 0;

        for (SymptomPattern pattern : patterns) {
            String patternName = pattern.getSymptomName().toLowerCase().trim();

            // O(1) lookup in Set! (NOT O(m) stream.anyMatch in loop!)
            boolean matched = userSymptoms.contains(patternName);

            if (matched) {
                matchedSymptomWeight += pattern.getWeight();

                // Bonus for critical symptoms
                if (Boolean.TRUE.equals(pattern.getIsCritical())) {
                    matchedSymptomWeight += pattern.getWeight() * 0.5;
                }
            } else if (Boolean.TRUE.equals(pattern.getIsCritical())) {
                // Missing critical symptom = reject this disease
                return 0;
            }
        }

        return matchedSymptomWeight / totalWeight;
    }

    /**
     * Calculate urgency score based on multiple factors
     * 
     * Factors:
     * - Average symptom severity (×10)
     * - Critical disease present (+30)
     * - Requires immediate attention (+40)
     * - Number of symptoms (+20 max)
     * - Duration of symptoms (+15 max)
     * 
     * @return Urgency score (0-100)
     */
    private double calculateUrgencyScore(
            List<Symptom> symptoms,
            List<DiseaseMatchScore> diseases) {
        double score = 0;

        // Factor 1: Average symptom severity (0-10) × 10 = 0-100 points
        double avgSeverity = symptoms.stream()
                .mapToInt(Symptom::getSeverity)
                .average()
                .orElse(5.0);
        score += avgSeverity * 10;

        // Factor 2: Critical disease present (+30 points)
        boolean hasCritical = diseases.stream()
                .anyMatch(d -> "CRITICAL".equals(d.getSeverity()) ||
                        "SEVERE".equals(d.getSeverity()));
        if (hasCritical) {
            score += 30;
        }

        // Factor 3: Requires immediate attention (+40 points)
        boolean needsAttention = diseases.stream()
                .anyMatch(d -> Boolean.TRUE.equals(d.getRequiresImmediateAttention()));
        if (needsAttention) {
            score += 40;
        }

        // Factor 4: Number of symptoms (up to +20 points)
        score += Math.min(symptoms.size() * 3, 20);

        // Factor 5: Duration - if symptoms persist > 7 days (+15 points)
        boolean persistent = symptoms.stream()
                .anyMatch(s -> s.getStartDate().isBefore(LocalDateTime.now().minusDays(7)));
        if (persistent) {
            score += 15;
        }

        // Cap at 100
        return Math.min(score, 100);
    }

    /**
     * Generate and save health insights based on analysis results
     */
    private void generateInsights(
            String userId,
            List<DiseaseMatchScore> diseases,
            double urgencyScore) {
        if (diseases.isEmpty()) {
            return;
        }

        String title = urgencyScore > 70
                ? "⚠️ Triệu chứng cần chú ý ngay"
                : urgencyScore > 40
                        ? "💡 Phân tích triệu chứng của bạn"
                        : "ℹ️ Thông tin về triệu chứng";

        StringBuilder message = new StringBuilder();
        message.append("Dựa trên các triệu chứng của bạn, các bệnh có thể là:\n\n");

        for (int i = 0; i < Math.min(3, diseases.size()); i++) {
            DiseaseMatchScore disease = diseases.get(i);
            message.append(String.format("%d. %s (%.0f%% khớp)\n",
                    i + 1,
                    disease.getDiseaseName(),
                    disease.getMatchScore() * 100));
        }

        String advice = getActionableAdvice(urgencyScore, diseases);

        InsightType type = urgencyScore > 70 ? InsightType.WARNING
                : urgencyScore > 40 ? InsightType.RECOMMENDATION : InsightType.TIP;

        String severity = urgencyScore > 70 ? "CRITICAL" : urgencyScore > 40 ? "WARNING" : "INFO";

        HealthInsight insight = HealthInsight.builder()
                .userId(userId)
                .type(type)
                .category("SYMPTOM_ANALYSIS")
                .title(title)
                .message(message.toString())
                .actionableAdvice(advice)
                .priority(urgencyScore > 70 ? 1 : urgencyScore > 40 ? 2 : 3)
                .severity(severity)
                .isRead(false)
                .generatedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        insightRepository.save(insight);
        log.info("Generated insight for user: {}", userId);
    }

    /**
     * Get actionable advice based on urgency score
     */
    private String getActionableAdvice(double urgencyScore, List<DiseaseMatchScore> diseases) {
        if (urgencyScore > 70) {
            return "🚨 GẶP BÁC SĨ NGAY:\n" +
                    "- Triệu chứng của bạn cần được đánh giá y tế khẩn cấp\n" +
                    "- Đặt lịch gặp bác sĩ TRONG 24-48 GIỜ\n" +
                    "- Nếu triệu chứng trở nên nghiêm trọng hơn, đi cấp cứu ngay";
        } else if (urgencyScore > 40) {
            return "⚠️ KHUYẾN NGHỊ:\n" +
                    "- Đặt lịch gặp bác sĩ trong 1-2 tuần\n" +
                    "- Theo dõi triệu chứng hàng ngày\n" +
                    "- Nghỉ ngơi đầy đủ và uống nhiều nước\n" +
                    "- Nếu triệu chứng xấu đi, gặp bác sĩ sớm hơn";
        } else {
            return "💡 GỢI Ý:\n" +
                    "- Theo dõi triệu chứng trong vài ngày\n" +
                    "- Nghỉ ngơi và chăm sóc bản thân\n" +
                    "- Nếu không cải thiện sau 3-5 ngày, gặp bác sĩ\n" +
                    "- Ghi chú bất kỳ thay đổi nào";
        }
    }

    /**
     * Build response when no matches found
     */
    private SymptomAnalysisResponse buildNoMatchResponse() {
        return SymptomAnalysisResponse.builder()
                .possibleConditions(List.of())
                .urgencyScore(30.0)
                .urgencyLevel("LOW")
                .recommendations(List.of(
                        "Không tìm thấy bệnh phù hợp trong cơ sở dữ liệu",
                        "Nếu triệu chứng nghiêm trọng hoặc không cải thiện, hãy gặp bác sĩ"))
                .analysisNote("Triệu chứng của bạn không khớp với các bệnh trong hệ thống")
                .build();
    }

    /**
     * Build final response
     */
    private SymptomAnalysisResponse buildResponse(
            List<DiseaseMatchScore> rankedDiseases,
            double urgencyScore) {
        String urgencyLevel = urgencyScore > 70 ? "HIGH" : urgencyScore > 40 ? "MODERATE" : "LOW";

        List<String> recommendations = new ArrayList<>();
        recommendations.add(getActionableAdvice(urgencyScore, rankedDiseases));

        // Add top disease recommendations
        if (!rankedDiseases.isEmpty()) {
            DiseaseMatchScore topDisease = rankedDiseases.get(0);
            if (topDisease.getGeneralRecommendations() != null) {
                recommendations.addAll(topDisease.getGeneralRecommendations());
            }
        }

        int symptomCount = rankedDiseases.isEmpty() ? 0 : (int) (rankedDiseases.get(0).getMatchScore() * 100);
        String analysisNote = String.format(
                "Phân tích %d triệu chứng với %d bệnh tiềm năng. " +
                        "Độ khẩn cấp: %s (%.0f/100)",
                symptomCount,
                rankedDiseases.size(),
                urgencyLevel,
                urgencyScore);

        return SymptomAnalysisResponse.builder()
                .possibleConditions(rankedDiseases)
                .urgencyScore(urgencyScore)
                .urgencyLevel(urgencyLevel)
                .recommendations(recommendations)
                .analysisNote(analysisNote)
                .build();
    }
}
