package pisco.analystapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Autenticazione", description = "Accesso dell'analista. Il paziente non si autentica mai.")
public class AuthController {

    private final AuthService authService;

    /** The email is logged for audit; the password never appears in any log line. */
    @Operation(
            summary = "Effettua il login e rilascia un JWT",
            description = "Restituisce token, scadenza e i dati dell'analista. "
                    + "Il token va incollato in Authorize, senza il prefisso \"Bearer\".")
    @SecurityRequirements
    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO request) {
        log.info("POST /api/auth/login email={}", request.getEmail());
        return authService.login(request);
    }

}
