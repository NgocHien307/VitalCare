package com.healthtracker.dss.engine;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * Result of rule evaluation containing all fired rules and recommendations
 */
@Data
public class RuleResult {
    
    private List<String> firedRuleNames = new ArrayList<>();
    private List<String> recommendations = new ArrayList<>();
    private String highestSeverity = "INFO";
    
    /**
     * Add a fired rule to the result
     */
    public void addFiredRule(Rule<?> rule) {
        firedRuleNames.add(rule.getRuleName());
    }
    
    /**
     * Add a recommendation to the result
     */
    public void addRecommendation(String recommendation) {
        recommendations.add(recommendation);
    }
    
    /**
     * Update the highest severity level
     */
    public void updateSeverity(String severity) {
        // Priority: CRITICAL > WARNING > INFO
        if ("CRITICAL".equals(severity)) {
            this.highestSeverity = "CRITICAL";
        } else if ("WARNING".equals(severity) && !"CRITICAL".equals(this.highestSeverity)) {
            this.highestSeverity = "WARNING";
        }
    }
    
    /**
     * Check if any rules were fired
     */
    public boolean hasResults() {
        return !firedRuleNames.isEmpty();
    }
}

