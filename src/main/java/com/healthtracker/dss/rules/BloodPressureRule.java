package com.healthtracker.dss.rules;

import com.healthtracker.dss.engine.Rule;
import com.healthtracker.model.HealthMetric;
import com.healthtracker.model.MetricType;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

/**
 * Rule for evaluating persistent high blood pressure
 * Checks if last 3 BP readings show hypertension
 */
@Component
public class BloodPressureRule implements Rule<List<HealthMetric>> {
    
    private String recommendation;
    
    @Override
    public boolean evaluate(List<HealthMetric> metrics) {
        // Get last 3 blood pressure readings
        List<HealthMetric> bpReadings = metrics.stream()
                .filter(m -> m.getMetricType() == MetricType.BLOOD_PRESSURE)
                .filter(m -> m.getSystolic() != null && m.getDiastolic() != null)
                .sorted(Comparator.comparing(HealthMetric::getMeasuredAt).reversed())
                .limit(3)
                .toList();
        
        if (bpReadings.size() < 3) {
            return false;
        }
        
        // Check if all 3 readings show hypertension (≥140/90)
        boolean allHigh = bpReadings.stream()
                .allMatch(m -> m.getSystolic() >= 140 || m.getDiastolic() >= 90);
        
        if (allHigh) {
            double avgSystolic = bpReadings.stream()
                    .mapToDouble(HealthMetric::getSystolic)
                    .average()
                    .orElse(0);
            double avgDiastolic = bpReadings.stream()
                    .mapToDouble(HealthMetric::getDiastolic)
                    .average()
                    .orElse(0);
            
            recommendation = "⚠️ CẢNH BÁO: Huyết áp cao liên tục trong 3 lần đo gần nhất\n" +
                           String.format("Trung bình: %.0f/%.0f mmHg\n", avgSystolic, avgDiastolic) +
                           "Khuyến nghị:\n" +
                           "1. Gặp bác sĩ tim mạch trong 1-2 tuần\n" +
                           "2. Giảm muối trong chế độ ăn (< 5g/ngày)\n" +
                           "3. Tăng hoạt động thể chất\n" +
                           "4. Giảm stress, ngủ đủ giấc\n" +
                           "5. Hạn chế rượu bia\n" +
                           "6. Theo dõi huyết áp hàng ngày";
            
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
        return "CRITICAL";
    }
    
    @Override
    public String getRuleName() {
        return "PERSISTENT_HYPERTENSION";
    }
}

