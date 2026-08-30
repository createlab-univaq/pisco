package pisco.analystapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.common.LogUtils;
import pisco.analystapi.model.dto.ResolvedPathDTO;
import pisco.analystapi.service.PatientPathService;

/**
 * Redeeming a unique code. Assigning and removing paths happen under the patient, on
 * {@link PatientController}; this is the one route the patient's own client calls.
 */
@RestController
@RequestMapping("/api/paths")
@RequiredArgsConstructor
@Slf4j
@Tag(
        name = "Percorsi",
        description = "Riscatto del codice univoco da parte del client del paziente. "
                + "Assegnazione e rimozione stanno sotto il paziente.")
public class PathController {

    private final PatientPathService service;

    /**
     * Unauthenticated by design (spec section 1): the patient has no login and redeems
     * the code they were given. The code is masked in the log -- here it is a credential.
     */
    @Operation(
            summary = "Risolve un codice univoco nel flow assegnato",
            description = "Endpoint pubblico (spec sezione 1): il paziente non ha login e "
                    + "riscatta il codice ricevuto. Restituisce il flow senza flowJson e non "
                    + "espone alcun dato anagrafico del paziente.")
    @SecurityRequirements
    @GetMapping("/resolve/{uniqueCode}")
    public ResolvedPathDTO resolve(@PathVariable String uniqueCode) {
        log.info("GET /api/paths/resolve/{}", LogUtils.maskCode(uniqueCode));
        return service.resolve(uniqueCode);
    }
}
