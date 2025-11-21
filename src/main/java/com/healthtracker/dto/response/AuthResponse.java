package com.healthtracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for authentication response containing JWT token
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private String type = "Bearer";

    private String userId;

    private String email;

    private String fullName;

    public AuthResponse(String token, String userId, String email, String fullName) {
        this.token = token;
        this.type = "Bearer";
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
    }
}
