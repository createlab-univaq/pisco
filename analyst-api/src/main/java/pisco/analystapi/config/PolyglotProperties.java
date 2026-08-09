package pisco.analystapi.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Only what actually varies between deployments. The routes themselves are part of
 * Polyglot's contract, not configuration, so they live in the client.
 */
@ConfigurationProperties(prefix = "polyglot")
public record PolyglotProperties(
        String baseUrl,
        String serviceToken,
        Duration connectTimeout,
        Duration readTimeout) {}
