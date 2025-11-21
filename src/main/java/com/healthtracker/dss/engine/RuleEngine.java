package com.healthtracker.dss.engine;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Rule engine for evaluating health rules
 */
@Component
@Slf4j
public class RuleEngine {
    
    /**
     * Evaluate a list of rules against input data
     * 
     * @param input Input data
     * @param rules List of rules to evaluate
     * @param <T> Type of input data
     * @return RuleResult containing all fired rules and recommendations
     */
    public <T> RuleResult evaluateRules(T input, List<Rule<T>> rules) {
        RuleResult result = new RuleResult();
        
        log.debug("Evaluating {} rules", rules.size());
        
        for (Rule<T> rule : rules) {
            try {
                if (rule.evaluate(input)) {
                    log.info("Rule fired: {}", rule.getRuleName());
                    
                    result.addFiredRule(rule);
                    result.addRecommendation(rule.getRecommendation());
                    result.updateSeverity(rule.getSeverity());
                }
            } catch (Exception e) {
                log.error("Error evaluating rule: {}", rule.getRuleName(), e);
            }
        }
        
        log.debug("Evaluation complete. Fired rules: {}", result.getFiredRuleNames().size());
        
        return result;
    }
}

