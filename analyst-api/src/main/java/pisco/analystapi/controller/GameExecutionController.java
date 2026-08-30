package pisco.analystapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.common.LogUtils;
import pisco.analystapi.model.dto.GameExecutionDTO;
import pisco.analystapi.service.GameExecutionService;

/**
 * An execution is an ordinary record: the game is played elsewhere and reports what
 * happened, so there is no session to open or close here.
 */
@RestController
@RequestMapping("/api/game-executions")
@RequiredArgsConstructor
@Slf4j
@Tag(
        name = "Esecuzioni di gioco",
        description = "Telemetria delle partite. La partita si svolge altrove: qui viene solo "
                + "registrata, gia' conclusa e completa delle sue risposte.")
public class GameExecutionController {

    private final GameExecutionService service;

    // --- Unauthenticated: written by the patient's client ------------------------------

    /** The unique code in the body is the only credential. */
    @Operation(
            summary = "Registra un'esecuzione con le sue risposte",
            description = "Endpoint pubblico: il client del paziente non ha login e il codice "
                    + "flowCode nel corpo e' l'unica credenziale. Le date sono quelle misurate "
                    + "dal gioco, non quelle di arrivo della richiesta; finishedAt puo' mancare "
                    + "se la sessione non e' mai stata chiusa.")
    @SecurityRequirements
    @PostMapping
    public ResponseEntity<GameExecutionDTO> create(@Valid @RequestBody GameExecutionDTO dto) {
        log.info("POST /api/game-executions flowCode={} nodi={}",
                LogUtils.maskCode(dto.getFlowCode()),
                dto.getNodes() == null ? 0 : dto.getNodes().size());
        GameExecutionDTO created = service.create(dto);
        return ResponseEntity.created(URI.create("/api/game-executions/" + created.getId()))
                .body(created);
    }

    // --- Analyst-only ------------------------------------------------------------------

    @Operation(
            summary = "Elenca le esecuzioni",
            description = "Solo quelle dei percorsi assegnati dal chiamante. Filtrabili per "
                    + "paziente. I nodi non sono inclusi: usare il dettaglio.")
    @GetMapping
    public List<GameExecutionDTO> list(@RequestParam(required = false) UUID patientId) {
        log.info("GET /api/game-executions patientId={}", patientId);
        return service.findAll(patientId);
    }

    /** Includes every answer recorded, ordered by sequence number. */
    @Operation(
            summary = "Recupera un'esecuzione con i suoi nodi",
            description = "Include ogni nodo giocato con le sue risposte, nell'ordine inviato.")
    @GetMapping("/{id}")
    public GameExecutionDTO get(@PathVariable UUID id) {
        log.info("GET /api/game-executions/{}", id);
        return service.findById(id);
    }

    @Operation(
            summary = "Elenca le esecuzioni di un codice univoco",
            description = "Riservato all'analista, a differenza della scrittura: il client del "
                    + "paziente registra la telemetria ma non ne rilegge lo storico.")
    @GetMapping("/by-code/{uniqueCode}")
    public List<GameExecutionDTO> listByCode(@PathVariable String uniqueCode) {
        log.info("GET /api/game-executions/by-code/{}", LogUtils.maskCode(uniqueCode));
        return service.findByUniqueCode(uniqueCode);
    }

    @Operation(
            summary = "Elimina un'esecuzione",
            description = "Nodi e risposte associati vengono eliminati con essa.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("DELETE /api/game-executions/{}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
