package com.healthtracker.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI (Swagger) configuration for API documentation
 * 
 * Access at: http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Health Tracker DSS API")
                        .version("1.0.0")
                        .description("Personal Health Tracker with Decision Support System\n\n" +
                                "Features:\n" +
                                "- Health metrics tracking (BP, blood sugar, weight, etc.)\n" +
                                "- Symptom tracking and analysis\n" +
                                "- Medicine and appointment management\n" +
                                "- AI-powered symptom analysis\n" +
                                "- Health risk predictions (cardiovascular, diabetes)\n" +
                                "- Automated health insights and recommendations")
                        .contact(new Contact()
                                .name("Health Tracker Team")
                                .email("support@healthtracker.com")
                                .url("https://healthtracker.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .addSecurityItem(new SecurityRequirement()
                        .addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT token obtained from /api/auth/login endpoint")));
    }
}

