package com.healthtracker.service;

import com.healthtracker.dto.request.LoginRequest;
import com.healthtracker.dto.request.RegisterRequest;
import com.healthtracker.dto.response.AuthResponse;
import com.healthtracker.dto.response.UserResponse;

/**
 * Interface for authentication operations
 * 
 * Provides contract for user authentication and registration operations.
 * Implementations should handle JWT token generation and password hashing.
 */
public interface IAuthService {

    /**
     * Register a new user
     * 
     * @param request Registration details including email, password, and profile
     *                info
     * @return AuthResponse containing JWT token and user info
     * @throws com.healthtracker.exception.BadRequestException if email already
     *                                                         exists
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticate user and generate JWT token
     * 
     * @param request Login credentials (email and password)
     * @return AuthResponse containing JWT token and user info
     * @throws org.springframework.security.authentication.BadCredentialsException if
     *                                                                             credentials
     *                                                                             are
     *                                                                             invalid
     */
    AuthResponse login(LoginRequest request);

    /**
     * Get current authenticated user details
     * 
     * @param email Email of the authenticated user
     * @return UserResponse containing user profile (excluding sensitive data)
     * @throws com.healthtracker.exception.ResourceNotFoundException if user not
     *                                                               found
     */
    UserResponse getCurrentUser(String email);
}
