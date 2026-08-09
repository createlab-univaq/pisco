package pisco.analystapi.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.config.security.DomainUserDetails;
import pisco.analystapi.model.dto.LoginRequestDTO;
import pisco.analystapi.model.dto.LoginResponseDTO;
import pisco.analystapi.model.mapper.AnalystMapper;
import pisco.analystapi.model.repository.AnalystRepository;
import pisco.analystapi.service.AuthService;
import pisco.analystapi.service.JwtService;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final AnalystRepository analystRepository;
    private final AnalystMapper analystMapper;
    private final JwtService jwtService;

    @Override
    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO request) {
        DomainUserDetails user = authenticate(request);

        JwtService.IssuedToken token =
                jwtService.issue(user.getId(), user.getUsername(), user.getRole().name());

        // Successful logins are worth an audit line; the token itself never goes in one.
        log.info("Login riuscito analystId={} ruolo={} scadenza={}",
                user.getId(), user.getRole(), token.expiresAt());

        // The token is enough to authenticate, but the dashboard wants the profile to
        // render straight after login rather than making a second call for it.
        return new LoginResponseDTO(
                token.value(),
                token.expiresAt(),
                analystMapper.toDto(analystRepository.getReferenceById(user.getId())));
    }

    private DomainUserDetails authenticate(LoginRequestDTO request) {
        String email = request.getEmail().trim().toLowerCase();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
            return (DomainUserDetails) authentication.getPrincipal();
        } catch (AuthenticationException ex) {
            // Logged at warn: repeated lines for one address are how you spot an attack.
            log.warn("Login fallito email={} motivo={}", email, ex.getClass().getSimpleName());
            // Unknown email and wrong password collapse into the same answer, so the
            // response cannot be used to discover which addresses are registered.
            throw new BadCredentialsException("Credenziali non valide", ex);
        }
    }
}
