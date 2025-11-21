package com.healthtracker.service.dss;

import com.healthtracker.model.*;
import com.healthtracker.repository.HealthMetricRepository;
import com.healthtracker.repository.HealthPredictionRepository;
import com.healthtracker.repository.HealthProfileRepository;
import com.healthtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Risk Prediction Service - Predicts health risks based on user data
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RiskPredictionService {

    private final UserRepository userRepository;
    private final HealthProfileRepository healthProfileRepository;
    private final HealthMetricRepository healthMetricRepository;
    private final HealthPredictionRepository predictionRepository;

    /**
     * Predict multiple health risks for a user
     */
    public List<HealthPrediction> predictHealthRisks(String userId) {
        log.info("Predicting health risks for user: {}", userId);

        User user = userRepository.findByEmail(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        HealthProfile profile = healthProfileRepository.findByUserId(userId)
                .orElse(null);

        if (profile == null) {
            log.warn("No health profile found for user: {}", userId);
            return List.of();
        }

        // Get recent metrics (last 6 months)
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        List<HealthMetric> recentMetrics = healthMetricRepository.findByUserIdAndMeasuredAtAfter(userId, sixMonthsAgo);

        List<HealthPrediction> predictions = new ArrayList<>();

        // Cardiovascular Disease Risk
        predictions.add(predictCardiovascularRisk(user, profile, recentMetrics));

        // Type 2 Diabetes Risk
        predictions.add(predictDiabetesRisk(user, profile, recentMetrics));

        // Weight Trend Prediction
        HealthPrediction weightPrediction = predictWeightTrend(profile, recentMetrics);
        if (weightPrediction != null) {
            predictions.add(weightPrediction);
        }

        // Save all predictions
        predictionRepository.saveAll(predictions);

        log.info("Generated {} predictions for user: {}", predictions.size(), userId);

        return predictions;
    }

    /**
     * Predict cardiovascular disease risk
     * 
     * Risk factors:
     * - Age >45 (+15 points)
     * - BMI >30 (+20 points), >25 (+10 points)
     * - High BP average (+25 points)
     * - Smoking (+20 points)
     * - Sedentary lifestyle (+10 points)
     * - Chronic diseases (+15 points)
     */
    private HealthPrediction predictCardiovascularRisk(
            User user,
            HealthProfile profile,
            List<HealthMetric> metrics) {
        int cardioRiskPoints = 0;
        List<String> riskFactors = new ArrayList<>();
        List<String> protectiveFactors = new ArrayList<>();

        // Age factor
        int age = Period.between(user.getDateOfBirth(), LocalDate.now()).getYears();
        if (age > 45) {
            cardioRiskPoints += 15;
            riskFactors.add(String.format("Tuổi %d (trên 45)", age));
        }

        // BMI factor
        if (profile.getBmi() != null) {
            if (profile.getBmi() > 30) {
                cardioRiskPoints += 20;
                riskFactors.add(String.format("BMI %.1f (béo phì)", profile.getBmi()));
            } else if (profile.getBmi() > 25) {
                cardioRiskPoints += 10;
                riskFactors.add(String.format("BMI %.1f (thừa cân)", profile.getBmi()));
            } else if (profile.getBmi() >= 18.5 && profile.getBmi() <= 24.9) {
                protectiveFactors.add("BMI bình thường");
            }
        }

        // Blood Pressure factor
        List<HealthMetric> bpMetrics = metrics.stream()
                .filter(m -> m.getMetricType() == MetricType.BLOOD_PRESSURE)
                .filter(m -> m.getSystolic() != null)
                .sorted(Comparator.comparing(HealthMetric::getMeasuredAt).reversed())
                .limit(3)
                .toList();

        if (!bpMetrics.isEmpty()) {
            double avgSystolic = bpMetrics.stream()
                    .mapToDouble(HealthMetric::getSystolic)
                    .average()
                    .orElse(120);

            if (avgSystolic >= 140) {
                cardioRiskPoints += 25;
                riskFactors.add(String.format("Huyết áp cao (TB: %.0f mmHg)", avgSystolic));
            } else if (avgSystolic < 120) {
                protectiveFactors.add("Huyết áp bình thường");
            }
        }

        // Smoking factor
        if ("CURRENT".equals(profile.getSmokingStatus())) {
            cardioRiskPoints += 20;
            riskFactors.add("Đang hút thuốc");
        } else if ("NEVER".equals(profile.getSmokingStatus())) {
            protectiveFactors.add("Không hút thuốc");
        }

        // Exercise factor
        if ("SEDENTARY".equals(profile.getExerciseFrequency())) {
            cardioRiskPoints += 10;
            riskFactors.add("Ít vận động");
        } else if ("ACTIVE".equals(profile.getExerciseFrequency()) ||
                "VERY_ACTIVE".equals(profile.getExerciseFrequency())) {
            protectiveFactors.add("Vận động thường xuyên");
        }

        // Chronic diseases
        if (profile.getChronicDiseases() != null && !profile.getChronicDiseases().isEmpty()) {
            cardioRiskPoints += 15;
            riskFactors.add("Có bệnh mãn tính");
        }

        // Determine risk level
        String riskLevel = cardioRiskPoints >= 60 ? "VERY_HIGH"
                : cardioRiskPoints >= 40 ? "HIGH" : cardioRiskPoints >= 20 ? "MODERATE" : "LOW";

        // Generate recommendations
        List<String> recommendations = generateCardioRecommendations(riskLevel, riskFactors);

        // Build prediction text
        String prediction = buildCardiovascularPredictionText(riskLevel, cardioRiskPoints);

        // Calculate confidence based on available data
        double confidence = calculateConfidence(bpMetrics.size(), profile);

        return HealthPrediction.builder()
                .userId(user.getEmail())
                .predictionType(PredictionType.DISEASE_RISK)
                .targetCondition("Bệnh tim mạch")
                .riskScore((double) cardioRiskPoints)
                .riskLevel(riskLevel)
                .prediction(prediction)
                .riskFactors(riskFactors)
                .protectiveFactors(protectiveFactors)
                .recommendations(recommendations)
                .algorithm("Cardiovascular-Risk-Score-v1")
                .confidenceScore(confidence)
                .predictedAt(LocalDateTime.now())
                .validUntil(LocalDateTime.now().plusMonths(6))
                .build();
    }

    /**
     * Predict Type 2 Diabetes risk
     */
    private HealthPrediction predictDiabetesRisk(
            User user,
            HealthProfile profile,
            List<HealthMetric> metrics) {
        int diabetesRiskPoints = 0;
        List<String> riskFactors = new ArrayList<>();
        List<String> protectiveFactors = new ArrayList<>();

        // Age factor
        int age = Period.between(user.getDateOfBirth(), LocalDate.now()).getYears();
        if (age > 45) {
            diabetesRiskPoints += 15;
            riskFactors.add(String.format("Tuổi %d (trên 45)", age));
        }

        // BMI factor
        if (profile.getBmi() != null) {
            if (profile.getBmi() >= 30) {
                diabetesRiskPoints += 25;
                riskFactors.add("BMI cao (béo phì)");
            } else if (profile.getBmi() >= 25) {
                diabetesRiskPoints += 15;
                riskFactors.add("Thừa cân");
            }
        }

        // Blood sugar factor
        List<HealthMetric> bsMetrics = metrics.stream()
                .filter(m -> m.getMetricType() == MetricType.BLOOD_SUGAR)
                .filter(m -> m.getValue() != null)
                .sorted(Comparator.comparing(HealthMetric::getMeasuredAt).reversed())
                .limit(3)
                .toList();

        if (!bsMetrics.isEmpty()) {
            double avgBloodSugar = bsMetrics.stream()
                    .mapToDouble(HealthMetric::getValue)
                    .average()
                    .orElse(0);

            if (avgBloodSugar >= 126) {
                diabetesRiskPoints += 30;
                riskFactors.add("Đường huyết cao");
            } else if (avgBloodSugar >= 100) {
                diabetesRiskPoints += 20;
                riskFactors.add("Tiền tiểu đường");
            } else if (avgBloodSugar < 100) {
                protectiveFactors.add("Đường huyết bình thường");
            }
        }

        // Family history
        if (profile.getFamilyMedicalHistory() != null &&
                profile.getFamilyMedicalHistory().stream()
                        .anyMatch(h -> h.toLowerCase().contains("tiểu đường") ||
                                h.toLowerCase().contains("diabetes"))) {
            diabetesRiskPoints += 20;
            riskFactors.add("Tiền sử gia đình có tiểu đường");
        }

        // Exercise
        if ("SEDENTARY".equals(profile.getExerciseFrequency())) {
            diabetesRiskPoints += 10;
            riskFactors.add("Ít vận động");
        } else if ("ACTIVE".equals(profile.getExerciseFrequency())) {
            protectiveFactors.add("Vận động đều đặn");
        }

        String riskLevel = diabetesRiskPoints >= 60 ? "VERY_HIGH"
                : diabetesRiskPoints >= 40 ? "HIGH" : diabetesRiskPoints >= 20 ? "MODERATE" : "LOW";

        List<String> recommendations = generateDiabetesRecommendations(riskLevel);

        String prediction = String.format(
                "Nguy cơ Tiểu đường Type 2: %s\n\n" +
                        "Điểm nguy cơ: %d/100\n" +
                        "%s",
                riskLevel.equals("VERY_HIGH") ? "RẤT CAO"
                        : riskLevel.equals("HIGH") ? "CAO" : riskLevel.equals("MODERATE") ? "VỪA PHẢI" : "THẤP",
                diabetesRiskPoints,
                riskLevel.equals("LOW") ? "Bạn có nguy cơ tiểu đường thấp. Tiếp tục duy trì lối sống lành mạnh."
                        : "Bạn nên thực hiện các biện pháp phòng ngừa để giảm nguy cơ.");

        return HealthPrediction.builder()
                .userId(user.getEmail())
                .predictionType(PredictionType.DISEASE_RISK)
                .targetCondition("Tiểu đường Type 2")
                .riskScore((double) diabetesRiskPoints)
                .riskLevel(riskLevel)
                .prediction(prediction)
                .riskFactors(riskFactors)
                .protectiveFactors(protectiveFactors)
                .recommendations(recommendations)
                .algorithm("Diabetes-Risk-Score-v1")
                .confidenceScore(calculateConfidence(bsMetrics.size(), profile))
                .predictedAt(LocalDateTime.now())
                .validUntil(LocalDateTime.now().plusMonths(6))
                .build();
    }

    /**
     * Predict weight trend
     */
    private HealthPrediction predictWeightTrend(
            HealthProfile profile,
            List<HealthMetric> metrics) {
        List<HealthMetric> weightMetrics = metrics.stream()
                .filter(m -> m.getMetricType() == MetricType.WEIGHT)
                .filter(m -> m.getValue() != null)
                .sorted(Comparator.comparing(HealthMetric::getMeasuredAt))
                .toList();

        if (weightMetrics.size() < 3) {
            return null; // Not enough data
        }

        // Simple trend analysis
        double firstWeight = weightMetrics.get(0).getValue();
        double lastWeight = weightMetrics.get(weightMetrics.size() - 1).getValue();
        double change = lastWeight - firstWeight;
        double changePercent = (change / firstWeight) * 100;

        String trend = change > 2 ? "TĂNG" : change < -2 ? "GIẢM" : "ỔN ĐỊNH";
        String riskLevel = Math.abs(changePercent) > 10 ? "HIGH" : Math.abs(changePercent) > 5 ? "MODERATE" : "LOW";

        String prediction = String.format(
                "Xu hướng cân nặng: %s\n\n" +
                        "Thay đổi: %.1f kg (%.1f%%)\n" +
                        "Trong %d tháng qua",
                trend,
                change,
                changePercent,
                6);

        List<String> recommendations = new ArrayList<>();
        if (change > 5) {
            recommendations.add("Cân nặng tăng đáng kể - Xem xét chế độ ăn");
            recommendations.add("Tăng hoạt động thể chất");
        } else if (change < -5) {
            recommendations.add("Cân nặng giảm đáng kể - Kiểm tra nguyên nhân");
            recommendations.add("Đảm bảo dinh dưỡng đầy đủ");
        } else {
            recommendations.add("Cân nặng ổn định - Tiếp tục duy trì");
        }

        return HealthPrediction.builder()
                .userId(profile.getUserId())
                .predictionType(PredictionType.HEALTH_TREND)
                .targetCondition("Xu hướng cân nặng")
                .riskScore(Math.abs(changePercent))
                .riskLevel(riskLevel)
                .prediction(prediction)
                .riskFactors(List.of())
                .protectiveFactors(List.of())
                .recommendations(recommendations)
                .algorithm("Weight-Trend-Analysis-v1")
                .confidenceScore(75.0)
                .predictedAt(LocalDateTime.now())
                .validUntil(LocalDateTime.now().plusMonths(3))
                .build();
    }

    private List<String> generateCardioRecommendations(String riskLevel, List<String> riskFactors) {
        List<String> recommendations = new ArrayList<>();

        if ("VERY_HIGH".equals(riskLevel) || "HIGH".equals(riskLevel)) {
            recommendations.add("🏥 Gặp bác sĩ tim mạch để đánh giá chi tiết");
            recommendations.add("💊 Có thể cần dùng thuốc dự phòng");
        }

        recommendations.add("🏃 Tập thể dục đều đặn (150 phút/tuần)");
        recommendations.add("🥗 Chế độ ăn DASH: nhiều rau củ, ít muối");
        recommendations.add("🚭 Bỏ thuốc lá nếu đang hút");
        recommendations.add("⚖️ Duy trì cân nặng khỏe mạnh");
        recommendations.add("😴 Ngủ đủ 7-8 giờ/đêm");
        recommendations.add("📊 Theo dõi huyết áp thường xuyên");

        return recommendations;
    }

    private List<String> generateDiabetesRecommendations(String riskLevel) {
        List<String> recommendations = new ArrayList<>();

        if ("VERY_HIGH".equals(riskLevel) || "HIGH".equals(riskLevel)) {
            recommendations.add("🏥 Kiểm tra HbA1c với bác sĩ");
        }

        recommendations.add("🥗 Giảm đường và tinh bột tinh chế");
        recommendations.add("🏃 Tập thể dục 30 phút/ngày");
        recommendations.add("⚖️ Giảm 5-10% cân nặng nếu thừa cân");
        recommendations.add("🍎 Ăn nhiều rau xanh, ngũ cốc nguyên hạt");
        recommendations.add("📊 Theo dõi đường huyết định kỳ");

        return recommendations;
    }

    private String buildCardiovascularPredictionText(String riskLevel, int points) {
        String levelText = riskLevel.equals("VERY_HIGH") ? "RẤT CAO"
                : riskLevel.equals("HIGH") ? "CAO" : riskLevel.equals("MODERATE") ? "VỪA PHẢI" : "THẤP";

        return String.format(
                "Nguy cơ Bệnh tim mạch: %s\n\n" +
                        "Điểm nguy cơ: %d/100\n\n" +
                        "%s",
                levelText,
                points,
                riskLevel.equals("LOW") ? "Bạn có nguy cơ bệnh tim mạch thấp. Hãy duy trì lối sống lành mạnh."
                        : "Bạn nên thực hiện các biện pháp để giảm nguy cơ bệnh tim mạch.");
    }

    private double calculateConfidence(int dataPoints, HealthProfile profile) {
        double confidence = 50.0; // Base confidence

        // More data = higher confidence
        confidence += Math.min(dataPoints * 5, 25);

        // Complete profile = higher confidence
        if (profile.getBmi() != null)
            confidence += 10;
        if (profile.getSmokingStatus() != null)
            confidence += 5;
        if (profile.getExerciseFrequency() != null)
            confidence += 5;
        if (profile.getFamilyMedicalHistory() != null)
            confidence += 5;

        return Math.min(confidence, 100);
    }
}
