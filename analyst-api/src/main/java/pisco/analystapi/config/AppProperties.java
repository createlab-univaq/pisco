package pisco.analystapi.config;

import java.time.Duration;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Cors cors, Jwt jwt) {

    public record Cors(List<String> allowedOrigins) {}

    /**
     * @param issuer stamped into the {@code iss} claim and required back on every token,
     *               so it has to stay stable across a deployment's tokens
     */
    public record Jwt(String issuer, String secret, Duration expiresIn) {}
}
