package com.healthtracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for user response (NEVER expose password!)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private String id;
    
    private String email;
    
    // Password is NEVER included!
    
    private String fullName;
    
    private LocalDate dateOfBirth;
    
    private String gender;
    
    private String phoneNumber;
    
    private List<String> roles;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}

