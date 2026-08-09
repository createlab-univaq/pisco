package pisco.analystapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.model.dto.DiagnosisDTO;
import pisco.analystapi.service.DiagnosisService;

/**
 * A single diagnosis by id. Listing and creating happen under the patient that owns it,
 * on {@link PatientController}.
 */
@RestController
@RequestMapping("/api/diagnoses")
@RequiredArgsConstructor
@Slf4j
@Tag(
        name = "Diagnosi",
        description = "Singola diagnosi per id. Elenco e creazione stanno sotto il paziente. "
                + "Accessibili solo all'analista che le ha redatte.")
public class DiagnosisController {

    private final DiagnosisService service;

    @Operation(summary = "Recupera una diagnosi")
    @GetMapping("/{id}")
    public DiagnosisDTO get(@PathVariable UUID id) {
        log.info("GET /api/diagnoses/{}", id);
        return service.findById(id);
    }

    /** The diagnosis text is clinical data and is deliberately not logged. */
    @Operation(
            summary = "Modifica una diagnosi",
            description = "Il paziente non e' modificabile: una diagnosi resta legata "
                    + "all'assegnazione su cui e' nata.")
    @PutMapping("/{id}")
    public DiagnosisDTO update(@PathVariable UUID id, @Valid @RequestBody DiagnosisDTO dto) {
        log.info("PUT /api/diagnoses/{} data={}", id, dto.getDiagnosisDate());
        return service.update(id, dto);
    }

    @Operation(summary = "Elimina una diagnosi")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("DELETE /api/diagnoses/{}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
