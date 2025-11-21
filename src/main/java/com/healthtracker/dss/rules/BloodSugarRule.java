package com.healthtracker.dss.rules;

import com.healthtracker.dss.engine.Rule;
import com.healthtracker.model.HealthMetric;
import com.healthtracker.model.MetricType;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

/**
 * Rule for evaluating blood sugar levels and diabetes risk
 */
@Component
public class BloodSugarRule implements Rule<List<HealthMetric>> {
    
    private String recommendation;
    private String severity;
    
    @Override
    public boolean evaluate(List<HealthMetric> metrics) {
        // Get last 3 blood sugar readings
        List<HealthMetric> bsReadings = metrics.stream()
                .filter(m -> m.getMetricType() == MetricType.BLOOD_SUGAR)
                .filter(m -> m.getValue() != null)
                .sorted(Comparator.comparing(HealthMetric::getMeasuredAt).reversed())
                .limit(3)
                .toList();
        
        if (bsReadings.size() < 2) {
            return false;
        }
        
        double avgBloodSugar = bsReadings.stream()
                .mapToDouble(HealthMetric::getValue)
                .average()
                .orElse(0);
        
        // Critical: Very high blood sugar (≥200 mg/dL)
        if (avgBloodSugar >= 200) {
            severity = "CRITICAL";
            recommendation = "⚠️ CẢNH BÁO: Đường huyết rất cao\n" +
                           String.format("Trung bình: %.0f mg/dL\n", avgBloodSugar) +
                           "Khuyến nghị:\n" +
                           "1. GẶP BÁC SĨ NGAY LẬP TỨC\n" +
                           "2. Kiểm tra tiểu đường\n" +
                           "3. Có thể cần dùng thuốc\n" +
                           "4. Theo dõi đường huyết hàng ngày";
            return true;
        }
        
        // Warning: High blood sugar (≥126 mg/dL fasting)
        if (avgBloodSugar >= 126) {
            severity = "WARNING";
            recommendation = "⚠️ Đường huyết cao - Nguy cơ tiểu đường\n" +
                           String.format("Trung bình: %.0f mg/dL\n", avgBloodSugar) +
                           "Khuyến nghị:\n" +
                           "1. Gặp bác sĩ để kiểm tra tiểu đường\n" +
                           "2. Giảm đường và tinh bột tinh chế\n" +
                           "3. Tăng hoạt động thể chất\n" +
                           "4. Giảm cân nếu thừa cân\n" +
                           "5. Theo dõi đường huyết thường xuyên";
            return true;
        }
        
        // Pre-diabetes (100-125 mg/dL)
        if (avgBloodSugar >= 100) {
            severity = "WARNING";
            recommendation = "💡 Tiền tiểu đường\n" +
                           String.format("Trung bình: %.0f mg/dL\n", avgBloodSugar) +
                           "Khuyến nghị:\n" +
                           "1. Thay đổi lối sống ngay để ngăn ngừa tiểu đường\n" +
                           "2. Giảm 5-10% cân nặng\n" +
                           "3. Tập thể dục 30 phút/ngày\n" +
                           "4. Ăn nhiều rau xanh, giảm đường\n" +
                           "5. Kiểm tra lại sau 3-6 tháng";
            return true;
        }
        
        return false;
    }
    
    @Override
    public String getRecommendation() {
        return recommendation;
    }
    
    @Override
    public String getSeverity() {
        return severity;
    }
    
    @Override
    public String getRuleName() {
        return "BLOOD_SUGAR_EVALUATION";
    }
}

