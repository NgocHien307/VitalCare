package com.healthtracker.config;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import java.util.Locale;

/**
 * Configuration for internationalization (i18n) support
 * 
 * This configuration enables multi-language support for the application.
 * Currently supports:
 * - Vietnamese (vi) - Default
 * - English (en)
 * 
 * Usage in services:
 * 
 * <pre>
 * {@code
 * @Autowired
 * private MessageSource messageSource;
 * 
 * public void someMethod() {
 *     String message = messageSource.getMessage(
 *             "message.key",
 *             new Object[] { "param1", "param2" },
 *             LocaleContextHolder.getLocale());
 * }
 * }
 * </pre>
 */
@Configuration
public class MessageSourceConfig {

    /**
     * Configure MessageSource for loading message properties files
     * 
     * @return MessageSource bean
     */
    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();

        // Set base name for message files (messages_vi.properties,
        // messages_en.properties)
        messageSource.setBasename("classpath:messages");

        // Set default encoding to UTF-8 for proper Vietnamese character support
        messageSource.setDefaultEncoding("UTF-8");

        // Cache messages for 1 hour in production (3600 seconds)
        // Set to -1 to reload on every access (for development)
        messageSource.setCacheSeconds(3600);

        // If message not found, return the code itself instead of throwing exception
        messageSource.setUseCodeAsDefaultMessage(true);

        return messageSource;
    }

    /**
     * Configure LocaleResolver to determine user's locale
     * 
     * Uses Accept-Language header from HTTP request.
     * Falls back to Vietnamese if no header present.
     * 
     * Example headers:
     * - "Accept-Language: vi" -> Vietnamese
     * - "Accept-Language: en" -> English
     * - "Accept-Language: vi-VN,vi;q=0.9,en;q=0.8" -> Vietnamese
     * 
     * @return LocaleResolver bean
     */
    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();

        // Set Vietnamese as default locale
        localeResolver.setDefaultLocale(new Locale("vi"));

        return localeResolver;
    }
}
