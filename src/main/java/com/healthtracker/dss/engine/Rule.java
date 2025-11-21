package com.healthtracker.dss.engine;

/**
 * Interface for health rules in the DSS
 * 
 * @param <T> Type of input data for the rule
 */
public interface Rule<T> {
    
    /**
     * Evaluate the rule against input data
     * 
     * @param input Input data to evaluate
     * @return true if rule condition is met, false otherwise
     */
    boolean evaluate(T input);
    
    /**
     * Get recommendation text when rule fires
     * 
     * @return Recommendation text
     */
    String getRecommendation();
    
    /**
     * Get severity level of the rule
     * 
     * @return Severity: INFO, WARNING, CRITICAL
     */
    String getSeverity();
    
    /**
     * Get unique name of the rule
     * 
     * @return Rule name
     */
    String getRuleName();
}

