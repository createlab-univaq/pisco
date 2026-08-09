package pisco.analystapi.service;

import java.time.Instant;
import java.util.UUID;

public interface JwtService {

    /** Takes plain values rather than the Analyst entity so this stays free of the domain. */
    IssuedToken issue(UUID analystId, String email, String role);

    record IssuedToken(String value, Instant expiresAt) {}
}
