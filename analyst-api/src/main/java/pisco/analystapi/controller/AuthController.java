package pisco.analystapi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.model.dto.LoginRequestDTO;
import pisco.analystapi.model.dto.LoginResponseDTO;
import pisco.analystapi.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /** The email is logged for audit; the password never appears in any log line. */
    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO request) {
        log.info("POST /api/auth/login email={}", request.getEmail());
        return authService.login(request);
    }

    /**
     * Nothing to do server-side: the only thing issued is a short-lived JWT, which
     * expires on its own. The endpoint exists because the spec lists it and because the
     * client wants somewhere to hang "discard the token" off.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        log.info("POST /api/auth/logout");
        return ResponseEntity.noContent().build();
    }
}
