package pisco.analystapi.config.security;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.util.Base64;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import pisco.analystapi.config.AppProperties;

/**
 * Key material and the two halves that use it: the encoder signs at login, the decoder
 * verifies on every request. Symmetric, so both take the same key.
 */
@Configuration
@RequiredArgsConstructor
public class JwtConfig {

    public static final MacAlgorithm ALGORITHM = MacAlgorithm.HS512;

    /** HS512 needs a key at least as long as its output. */
    private static final int MIN_KEY_BYTES = 64;

    private final AppProperties properties;

    @Bean
    public SecretKey jwtSecretKey() {
        byte[] keyBytes = Base64.getDecoder().decode(properties.jwt().secret());
        if (keyBytes.length < MIN_KEY_BYTES) {
            // Caught at startup rather than at the first login attempt.
            throw new IllegalStateException(
                    "app.jwt.secret troppo corta: %s richiede almeno %d byte, trovati %d"
                            .formatted(ALGORITHM.getName(), MIN_KEY_BYTES, keyBytes.length));
        }
        return new SecretKeySpec(keyBytes, ALGORITHM.getName());
    }

    @Bean
    public JwtEncoder jwtEncoder(SecretKey jwtSecretKey) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecretKey));
    }

    @Bean
    public JwtDecoder jwtDecoder(SecretKey jwtSecretKey) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(jwtSecretKey)
                .macAlgorithm(ALGORITHM)
                .build();
        // Signature, expiry and issuer. Nothing is revocable: only short-lived JWTs are
        // issued and they lapse on their own.
        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(properties.jwt().issuer()));
        return decoder;
    }
}
