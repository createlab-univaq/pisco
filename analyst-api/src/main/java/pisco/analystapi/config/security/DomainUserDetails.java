package pisco.analystapi.config.security;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pisco.analystapi.common.Constants;
import pisco.analystapi.model.entity.Analyst;
import pisco.analystapi.model.entity.Role;

/**
 * The authenticated analyst as Spring Security sees it. Carrying the domain id means the
 * services can scope their queries without re-parsing a token or hitting the database.
 *
 * <p>{@code username} is the email: it is what the analyst logs in with.
 */
@Getter
public class DomainUserDetails implements UserDetails {

    private final UUID id;
    private final String username;
    private final String password;
    private final Role role;
    private final Collection<? extends GrantedAuthority> authorities;

    public DomainUserDetails(UUID id, String username, String password, Role role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.authorities = List.of(
                new SimpleGrantedAuthority(Constants.Security.ROLE_PREFIX + role.name()));
    }

    public static DomainUserDetails from(Analyst analyst) {
        return new DomainUserDetails(
                analyst.getId(), analyst.getEmail(), analyst.getPasswordHash(), analyst.getRole());
    }

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }
}
