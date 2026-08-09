package pisco.analystapi.service.impl;

import java.security.SecureRandom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pisco.analystapi.model.repository.PatientPathRepository;

/**
 * Generates the code the patient redeems from their client.
 *
 * <p>It is the only credential guarding the unauthenticated endpoints, so it is 12
 * characters rather than the 6 the previous Node service used: 32^12 is about 10^18,
 * which puts guessing out of reach.
 */
@Component
@RequiredArgsConstructor
public class UniqueCodeGenerator {

    /** No O/0/I/1: the code gets read aloud and typed by hand. */
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int LENGTH = 12;
    private static final int MAX_ATTEMPTS = 10;

    private final SecureRandom random = new SecureRandom();
    private final PatientPathRepository repository;

    public String generate() {
        for (int attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            String candidate = randomCode();
            if (!repository.existsByUniqueCode(candidate)) {
                return candidate;
            }
        }
        // At this keyspace, ten collisions in a row means the generator is broken,
        // not that we were unlucky.
        throw new IllegalStateException(
                "Impossibile generare un codice univoco dopo %d tentativi".formatted(MAX_ATTEMPTS));
    }

    private String randomCode() {
        StringBuilder builder = new StringBuilder(LENGTH);
        for (int i = 0; i < LENGTH; i++) {
            builder.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }
        return builder.toString();
    }
}
