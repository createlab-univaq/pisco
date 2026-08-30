package pisco.analystapi.config;

import java.time.Duration;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.unit.DataSize;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Cors cors, Jwt jwt, Images images) {

    public record Cors(List<String> allowedOrigins) {}

    /**
     * @param issuer stamped into the {@code iss} claim and required back on every token,
     *               so it has to stay stable across a deployment's tokens
     */
    public record Jwt(String issuer, String secret, Duration expiresIn) {}

    /**
     * @param maxSize the largest image accepted, measured decoded. A bytea is read whole
     *                into memory on every download, so the ceiling is a memory decision
     *                rather than a storage one
     */
    public record Images(DataSize maxSize) {}
}
