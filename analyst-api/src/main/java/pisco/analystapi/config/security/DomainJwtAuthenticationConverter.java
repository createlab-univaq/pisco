package pisco.analystapi.config.security;

import java.util.UUID;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.stereotype.Component;
import pisco.analystapi.common.Constants;
import pisco.analystapi.model.entity.Role;

/**
 * Turns a verified token into the security context's Authentication.
 *
 * <p>Out of the box the resource server leaves the raw {@link Jwt} as the principal, which
 * forces every caller to re-parse claims. This puts a {@link DomainUserDetails} there
 * instead, built from the claims rather than from a database lookup -- the token already
 * carries id, email and role, so an authenticated request costs no extra query.
 */
@Component
public class DomainJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        DomainUserDetails principal = new DomainUserDetails(
                parseId(jwt),
                jwt.getClaimAsString(Constants.JwtClaims.EMAIL),
                // The token carries no password, and nothing downstream needs one.
                "",
                parseRole(jwt));

        // Credentials keep the token itself, so the raw value stays reachable if needed.
        return new UsernamePasswordAuthenticationToken(principal, jwt, principal.getAuthorities());
    }

    /**
     * A token we signed should always parse. If it does not, the token is the problem, so
     * it has to read as 401 rather than surfacing as a 500.
     */
    private static UUID parseId(Jwt jwt) {
        try {
            return UUID.fromString(jwt.getSubject());
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new InvalidBearerTokenException("Subject non valido nel token", ex);
        }
    }

    private static Role parseRole(Jwt jwt) {
        try {
            return Role.valueOf(jwt.getClaimAsString(Constants.JwtClaims.ROLE));
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new InvalidBearerTokenException("Ruolo non valido nel token", ex);
        }
    }
}
