package com.healthtracker.dss.engine;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for RuleEngine
 */
class RuleEngineTest {
    
    @Test
    @DisplayName("Should evaluate rules and return results")
    void testEvaluateRules() {
        // Given
        RuleEngine engine = new RuleEngine();
        TestRule rule1 = new TestRule(true, "Rule 1 recommendation", "WARNING", "RULE_1");
        TestRule rule2 = new TestRule(false, "Rule 2 recommendation", "INFO", "RULE_2");
        TestRule rule3 = new TestRule(true, "Rule 3 recommendation", "CRITICAL", "RULE_3");
        
        List<Rule<String>> rules = Arrays.asList(rule1, rule2, rule3);
        
        // When
        RuleResult result = engine.evaluateRules("test input", rules);
        
        // Then
        assertNotNull(result);
        assertEquals(2, result.getFiredRuleNames().size());
        assertTrue(result.getFiredRuleNames().contains("RULE_1"));
        assertTrue(result.getFiredRuleNames().contains("RULE_3"));
        assertEquals("CRITICAL", result.getHighestSeverity());
        assertTrue(result.hasResults());
    }
    
    @Test
    @DisplayName("Should handle empty rules list")
    void testEvaluateRules_EmptyList() {
        // Given
        RuleEngine engine = new RuleEngine();
        List<Rule<String>> rules = List.of();
        
        // When
        RuleResult result = engine.evaluateRules("test input", rules);
        
        // Then
        assertNotNull(result);
        assertEquals(0, result.getFiredRuleNames().size());
        assertFalse(result.hasResults());
    }
    
    // Test implementation of Rule interface
    static class TestRule implements Rule<String> {
        private final boolean shouldFire;
        private final String recommendation;
        private final String severity;
        private final String name;
        
        TestRule(boolean shouldFire, String recommendation, String severity, String name) {
            this.shouldFire = shouldFire;
            this.recommendation = recommendation;
            this.severity = severity;
            this.name = name;
        }
        
        @Override
        public boolean evaluate(String input) {
            return shouldFire;
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
            return name;
        }
    }
}

