package com.healthtracker.exception;

/**
 * Exception thrown when user tries to access unauthorized resources
 */
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
}

