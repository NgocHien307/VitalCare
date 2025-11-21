package com.healthtracker.dss.rules;

import com.healthtracker.dss.engine.Rule;
import com.healthtracker.model.HealthProfile;
import org.springframework.stereotype.Component;

/**
 * Rule for evaluating BMI and providing recommendations
 */
@Component
public class BMIRule implements Rule<HealthProfile> {
    
    private String recommendation;
    private String severity;
    
    @Override
    public boolean evaluate(HealthProfile profile) {
        if (profile == null || profile.getBmi() == null) {
            return false;
        }
        
        double bmi = profile.getBmi();
        
        if (bmi < 16.0) {
            severity = "CRITICAL";
            recommendation = "⚠️ CẢNH BÁO: BMI rất thấp (" + String.format("%.1f", bmi) + ")\n" +
                           "Nguy cơ suy dinh dưỡng nghiêm trọng.\n" +
                           "Khuyến nghị:\n" +
                           "1. Gặp bác sĩ dinh dưỡng NGAY\n" +
                           "2. Tăng lượng calo hấp thụ\n" +
                           "3. Kiểm tra sức khỏe tổng quát";
            return true;
        } else if (bmi < 18.5) {
            severity = "WARNING";
            recommendation = "⚠️ BMI thấp (" + String.format("%.1f", bmi) + ") - Thiếu cân\n" +
                           "Khuyến nghị:\n" +
                           "1. Tăng lượng calo hấp thụ\n" +
                           "2. Ăn nhiều bữa nhỏ trong ngày\n" +
                           "3. Tập luyện sức mạnh để tăng cơ";
            return true;
        } else if (bmi >= 30.0) {
            severity = bmi >= 35.0 ? "CRITICAL" : "WARNING";
            recommendation = (bmi >= 35.0 ? "⚠️ CẢNH BÁO: " : "⚠️ ") + 
                           "BMI cao (" + String.format("%.1f", bmi) + ") - Béo phì\n" +
                           "Khuyến nghị:\n" +
                           "1. Gặp bác sĩ để có kế hoạch giảm cân an toàn\n" +
                           "2. Giảm lượng calo hấp thụ\n" +
                           "3. Tăng hoạt động thể chất (ít nhất 150 phút/tuần)\n" +
                           "4. Kiểm tra các yếu tố nguy cơ tim mạch";
            return true;
        } else if (bmi >= 25.0) {
            severity = "WARNING";
            recommendation = "⚠️ BMI hơi cao (" + String.format("%.1f", bmi) + ") - Thừa cân\n" +
                           "Khuyến nghị:\n" +
                           "1. Giảm 5-10% cân nặng\n" +
                           "2. Ăn nhiều rau củ, giảm thực phẩm chế biến\n" +
                           "3. Tập thể dục đều đặn\n" +
                           "4. Theo dõi cân nặng hàng tuần";
            return true;
        }
        
        return false; // BMI normal (18.5-24.9)
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
        return "BMI_EVALUATION";
    }
}

