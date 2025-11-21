package com.healthtracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * User entity representing a user in the health tracker system
 */
@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    /**
     * BCrypt hashed password - NEVER expose in responses!
     */
    private String password;
    
    private String fullName;
    
    private LocalDate dateOfBirth;
    
    /**
     * Gender: MALE, FEMALE, OTHER
     */
    private String gender;
    
    private String phoneNumber;
    
    /**
     * User roles: ROLE_USER, ROLE_ADMIN
     */
    private List<String> roles;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}

