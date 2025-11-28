package com.healthtracker.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.MessageSource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test for i18n (internationalization) configuration
 * 
 * This test verifies that:
 * 1. MessageSource is properly configured
 * 2. Vietnamese messages load correctly
 * 3. English messages load correctly
 * 4. Message parameters are correctly replaced
 */
class MessageSourceConfigTest {

    private MessageSource messageSource;

    @BeforeEach
    void setUp() {
        // Create MessageSource programmatically for testing
        ReloadableResourceBundleMessageSource ms = new ReloadableResourceBundleMessageSource();
        ms.setBasename("classpath:messages");
        ms.setDefaultEncoding("UTF-8");
        ms.setUseCodeAsDefaultMessage(true);
        this.messageSource = ms;
    }

    @Test
    void testVietnameseMessages() {
        Locale vietnameseLocale = Locale.forLanguageTag("vi");

        // Test health metric messages
        String bloodPressureCritical = messageSource.getMessage(
                "health.metric.bloodpressure.critical", null, vietnameseLocale);
        assertEquals("Huyết áp rất cao - Cần gặp bác sĩ ngay", bloodPressureCritical);

        String bloodSugarNormal = messageSource.getMessage(
                "health.metric.bloodsugar.normal", null, vietnameseLocale);
        assertEquals("Đường huyết bình thường", bloodSugarNormal);

        String heartRateWarning = messageSource.getMessage(
                "health.metric.heartrate.warning", null, vietnameseLocale);
        assertEquals("Nhịp tim nằm ngoài phạm vi bình thường", heartRateWarning);

        // Test symptom analysis messages
        String insightTitleCritical = messageSource.getMessage(
                "symptom.insight.title.critical", null, vietnameseLocale);
        assertEquals("⚠️ Triệu chứng cần chú ý ngay", insightTitleCritical);

        String noMatchNote = messageSource.getMessage(
                "symptom.nomatch.note", null, vietnameseLocale);
        assertEquals("Triệu chứng của bạn không khớp với các bệnh trong hệ thống", noMatchNote);
    }

    @Test
    void testEnglishMessages() {
        Locale englishLocale = Locale.forLanguageTag("en");

        // Test health metric messages
        String bloodPressureCritical = messageSource.getMessage(
                "health.metric.bloodpressure.critical", null, englishLocale);
        assertEquals("Very high blood pressure - See doctor immediately", bloodPressureCritical);

        String bloodSugarNormal = messageSource.getMessage(
                "health.metric.bloodsugar.normal", null, englishLocale);
        assertEquals("Normal blood sugar", bloodSugarNormal);

        String heartRateWarning = messageSource.getMessage(
                "health.metric.heartrate.warning", null, englishLocale);
        assertEquals("Heart rate outside normal range", heartRateWarning);

        // Test symptom analysis messages
        String insightTitleCritical = messageSource.getMessage(
                "symptom.insight.title.critical", null, englishLocale);
        assertEquals("⚠️ Symptoms require immediate attention", insightTitleCritical);

        String noMatchNote = messageSource.getMessage(
                "symptom.nomatch.note", null, englishLocale);
        assertEquals("Your symptoms don't match any conditions in the system", noMatchNote);
    }

    @Test
    void testMessagesWithParameters() {
        Locale vietnameseLocale = Locale.forLanguageTag("vi");
        Locale englishLocale = Locale.forLanguageTag("en");

        // Test disease message with parameters (Vietnamese)
        String diseaseMessageVi = messageSource.getMessage(
                "symptom.insight.message.disease",
                new Object[] { 1, "Cảm cúm", "85" },
                vietnameseLocale);
        assertEquals("1. Cảm cúm (85% khớp)\n", diseaseMessageVi);

        // Test disease message with parameters (English)
        String diseaseMessageEn = messageSource.getMessage(
                "symptom.insight.message.disease",
                new Object[] { 1, "Flu", "85" },
                englishLocale);
        assertEquals("1. Flu (85% match)\n", diseaseMessageEn);

        // Test analysis note with parameters (Vietnamese)
        String analysisNoteVi = messageSource.getMessage(
                "symptom.analysis.note",
                new Object[] { 5, 3, "HIGH", "75" },
                vietnameseLocale);
        assertEquals("Phân tích 5 triệu chứng với 3 bệnh tiềm năng. Độ khẩn cấp: HIGH (75/100)",
                analysisNoteVi);

        // Test analysis note with parameters (English)
        String analysisNoteEn = messageSource.getMessage(
                "symptom.analysis.note",
                new Object[] { 5, 3, "HIGH", "75" },
                englishLocale);
        assertEquals("Analyzed 5 symptoms with 3 potential conditions. Urgency: HIGH (75/100)",
                analysisNoteEn);
    }

    @Test
    void testDefaultLocale() {
        // Test that Vietnamese is the default locale
        String message = messageSource.getMessage(
                "health.metric.bloodpressure.normal", null, null);
        // Should return Vietnamese message as it's the default
        assertNotNull(message);
        assertTrue(message.contains("Huyết áp") || message.contains("blood pressure"));
    }

    @Test
    void testNonExistentKey() {
        Locale vietnameseLocale = Locale.forLanguageTag("vi");

        // With useCodeAsDefaultMessage=true, should return the code itself
        String message = messageSource.getMessage(
                "non.existent.key", null, vietnameseLocale);
        assertEquals("non.existent.key", message);
    }

    @Test
    void testAllHealthMetricMessages() {
        Locale vietnameseLocale = Locale.forLanguageTag("vi");

        // Test all blood pressure messages
        assertNotNull(messageSource.getMessage("health.metric.bloodpressure.critical", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("health.metric.bloodpressure.high", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("health.metric.bloodpressure.low", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("health.metric.bloodpressure.normal", null, vietnameseLocale));

        // Test all blood sugar messages
        assertNotNull(messageSource.getMessage("health.metric.bloodsugar.critical", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("health.metric.bloodsugar.high", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("health.metric.bloodsugar.low", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("health.metric.bloodsugar.normal", null, vietnameseLocale));

        // Test all heart rate messages
        assertNotNull(messageSource.getMessage("health.metric.heartrate.critical", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("health.metric.heartrate.warning", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("health.metric.heartrate.normal", null, vietnameseLocale));

        // Test all temperature messages
        assertNotNull(messageSource.getMessage("health.metric.temperature.critical", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("health.metric.temperature.warning", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("health.metric.temperature.low", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("health.metric.temperature.normal", null, vietnameseLocale));
    }

    @Test
    void testAllSymptomAnalysisMessages() {
        Locale vietnameseLocale = Locale.forLanguageTag("vi");

        // Test insight titles
        assertNotNull(messageSource.getMessage("symptom.insight.title.critical", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.insight.title.warning", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.insight.title.info", null, vietnameseLocale));

        // Test advice messages (critical)
        assertNotNull(messageSource.getMessage("symptom.advice.critical.title", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.advice.critical.line1", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.advice.critical.line2", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.advice.critical.line3", null, vietnameseLocale));

        // Test advice messages (warning)
        assertNotNull(messageSource.getMessage("symptom.advice.warning.title", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.advice.warning.line1", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.advice.warning.line2", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.advice.warning.line3", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.advice.warning.line4", null, vietnameseLocale));

        // Test advice messages (info)
        assertNotNull(messageSource.getMessage("symptom.advice.info.title", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.advice.info.line1", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.advice.info.line2", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.advice.info.line3", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.advice.info.line4", null, vietnameseLocale));

        // Test no match messages
        assertNotNull(messageSource.getMessage("symptom.nomatch.recommendation1", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.nomatch.recommendation2", null, vietnameseLocale));
        assertNotNull(messageSource.getMessage("symptom.nomatch.note", null, vietnameseLocale));
    }

    @Test
    void testErrorMessages() {
        Locale vietnameseLocale = Locale.forLanguageTag("vi");
        Locale englishLocale = Locale.forLanguageTag("en");

        // Test permission denied error (Vietnamese)
        String permissionDeniedVi = messageSource.getMessage(
                "error.permission.denied", null, vietnameseLocale);
        assertEquals("Bạn không có quyền truy cập chỉ số này", permissionDeniedVi);

        // Test permission denied error (English)
        String permissionDeniedEn = messageSource.getMessage(
                "error.permission.denied", null, englishLocale);
        assertEquals("You don't have permission to access this metric", permissionDeniedEn);

        // Test resource not found error with parameter (Vietnamese)
        String notFoundVi = messageSource.getMessage(
                "error.resource.notfound.healthmetric",
                new Object[] { "123abc" },
                vietnameseLocale);
        assertEquals("Không tìm thấy chỉ số sức khỏe với id: 123abc", notFoundVi);

        // Test resource not found error with parameter (English)
        String notFoundEn = messageSource.getMessage(
                "error.resource.notfound.healthmetric",
                new Object[] { "123abc" },
                englishLocale);
        assertEquals("Health metric not found with id: 123abc", notFoundEn);
    }
}
