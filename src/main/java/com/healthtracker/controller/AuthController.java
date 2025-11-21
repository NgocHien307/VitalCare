package com.healthtracker.controller;

import com.healthtracker.dto.request.LoginRequest;
import com.healthtracker.dto.request.RegisterRequest;
import com.healthtracker.dto.response.AuthResponse;
import com.healthtracker.dto.response.UserResponse;
import com.healthtracker.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication endpoints
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Login user
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get current authenticated user
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        UserResponse response = authService.getCurrentUser(email);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Refresh token (optional - can be implemented later)
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(Authentication authentication) {
        // Implementation for token refresh if needed
        // For now, just return current user info
        String email = authentication.getName();
        UserResponse user = authService.getCurrentUser(email);
        
        // Generate new token
        AuthResponse response = AuthResponse.builder()
                .token("refreshed-token") // TODO: implement actual refresh logic
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
        
        return ResponseEntity.ok(response);
    }
}

