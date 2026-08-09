package pisco.analystapi.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.model.repository.AnalystRepository;

/**
 * Used at login, by the DaoAuthenticationProvider behind the AuthenticationManager.
 * Requests that arrive with a token do not come through here -- the identity is rebuilt
 * from the token's claims instead, so an authenticated call costs no extra query.
 */
@Service
@RequiredArgsConstructor
public class UserSecurityDetails implements UserDetailsService {

    private final AnalystRepository analystRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return analystRepository.findByEmail(username.trim().toLowerCase())
                .map(DomainUserDetails::from)
                .orElseThrow(() -> new UsernameNotFoundException("Analista %s non trovato".formatted(username)));
    }
}
