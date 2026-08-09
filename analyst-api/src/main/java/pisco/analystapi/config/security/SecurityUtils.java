package pisco.analystapi.config.security;

import java.util.Optional;
import java.util.UUID;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Reads the authenticated analyst out of the security context. Services call this instead
 * of taking an analyst id in every method signature.
 */
public final class SecurityUtils {

    private SecurityUtils() {}

    public static Optional<DomainUserDetails> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        return authentication.getPrincipal() instanceof DomainUserDetails user
                ? Optional.of(user)
                : Optional.empty();
    }

    /** For paths that are already behind authentication: absence here is a bug, not a case. */
    public static DomainUserDetails requireCurrentUser() {
        return getCurrentUser()
                .orElseThrow(() -> new AccessDeniedException("Autenticazione richiesta"));
    }

    public static UUID currentAnalystId() {
        return requireCurrentUser().getId();
    }

    public static boolean isAdmin() {
        return getCurrentUser().map(DomainUserDetails::isAdmin).orElse(false);
    }
}
