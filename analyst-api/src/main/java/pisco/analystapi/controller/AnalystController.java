package pisco.analystapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.model.dto.AnalystDTO;
import pisco.analystapi.model.dto.PatientDTO;
import pisco.analystapi.model.dto.validation.ValidationGroups.Create;
import pisco.analystapi.model.dto.validation.ValidationGroups.Update;
import pisco.analystapi.service.AnalystService;
import pisco.analystapi.service.PatientService;

@RestController
@RequestMapping("/api/analysts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Analisti", description = "Anagrafica dei professionisti e loro pazienti in carico.")
public class AnalystController {

    private final AnalystService service;
    private final PatientService patientService;

    /** Public: without it there is no way to create the first analyst. */
    @Operation(
            summary = "Registra un nuovo analista",
            description = "Endpoint pubblico: senza di esso non esisterebbe modo di creare "
                    + "il primo analista. Il ruolo e' assegnato dal server, non dal payload.")
    @SecurityRequirements
    @PostMapping
    public ResponseEntity<AnalystDTO> create(@Validated(Create.class) @RequestBody AnalystDTO dto) {
        log.info("POST /api/analysts email={}", dto.getEmail());
        AnalystDTO created = service.create(dto);
        return ResponseEntity.created(URI.create("/api/analysts/" + created.getId())).body(created);
    }

    @Operation(summary = "Elenca tutti gli analisti", description = "Riservato agli amministratori.")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AnalystDTO> list() {
        log.info("GET /api/analysts");
        return service.findAll();
    }

    /** Self or admin -- enforced in the service, which knows who is calling. */
    @Operation(
            summary = "Recupera un analista",
            description = "Consentito solo su se stessi, o a un amministratore.")
    @GetMapping("/{id}")
    public AnalystDTO get(@PathVariable UUID id) {
        log.info("GET /api/analysts/{}", id);
        return service.findById(id);
    }

    @Operation(
            summary = "Modifica un analista",
            description = "Consentito solo su se stessi, o a un amministratore. "
                    + "Omettere la password per lasciarla invariata.")
    @PutMapping("/{id}")
    public AnalystDTO update(@PathVariable UUID id, @Validated(Update.class) @RequestBody AnalystDTO dto) {
        log.info("PUT /api/analysts/{} email={}", id, dto.getEmail());
        return service.update(id, dto);
    }

    @Operation(
            summary = "Elimina un analista",
            description = "Rifiutato con 409 se ha ancora pazienti in carico: vanno prima "
                    + "eliminati o riassegnati.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("DELETE /api/analysts/{}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * The caseload: only the patients assigned to this analyst, where
     * {@code GET /api/patients} returns the whole register.
     */
    @Operation(
            summary = "Elenca i pazienti in carico a un analista",
            description = "Solo i pazienti assegnati. Per l'anagrafica completa usare "
                    + "GET /api/patients.")
    @GetMapping("/{id}/patients")
    public List<PatientDTO> listPatients(@PathVariable UUID id) {
        log.info("GET /api/analysts/{}/patients", id);
        return patientService.findAllForAnalyst(id);
    }
}
