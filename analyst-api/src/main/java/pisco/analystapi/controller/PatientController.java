package pisco.analystapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.model.dto.AnalystDTO;
import pisco.analystapi.model.dto.DiagnosisDTO;
import pisco.analystapi.model.dto.PatientDTO;
import pisco.analystapi.model.dto.PatientPathDTO;
import pisco.analystapi.service.AnalystService;
import pisco.analystapi.service.DiagnosisService;
import pisco.analystapi.service.PatientPathService;
import pisco.analystapi.service.PatientService;

/**
 * Everything rooted at a patient, including the collections that hang off one. A
 * diagnosis or an assigned path only exists in the context of its patient, so the routes
 * that create or list them belong here; the by-id routes live with their own resource.
 *
 * <p>Log lines carry identifiers only. Names, ages and diagnosis text are clinical data
 * and have no business sitting in a log file.
 */
@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@Slf4j
@Tag(
        name = "Pazienti",
        description = "Anagrafica consultabile da ogni analista; diagnosi e percorsi restano "
                + "invece visibili solo all'analista che ha il paziente in carico.")
public class PatientController {

    private final PatientService patientService;
    private final AnalystService analystService;
    private final DiagnosisService diagnosisService;
    private final PatientPathService patientPathService;

    // --- Patients ---------------------------------------------------------------------

    /**
     * The whole register, not just the caller's caseload -- an analyst has to be able to
     * find a patient already known to a colleague instead of entering them a second time.
     * For one analyst's own patients, see {@code GET /api/analysts/{id}/patients}.
     */
    @Operation(
            summary = "Elenca tutti i pazienti",
            description = "L'anagrafica completa, non solo i propri pazienti: serve a trovare "
                    + "chi e' gia' noto a un collega invece di inserirlo una seconda volta. "
                    + "Per i soli pazienti in carico usare GET /api/analysts/{id}/patients.")
    @GetMapping
    public List<PatientDTO> list() {
        log.info("GET /api/patients");
        return patientService.findAll();
    }

    /** The mirror of the caseload: who is currently following this patient. */
    @Operation(
            summary = "Elenca gli analisti che seguono un paziente",
            description = "Speculare a GET /api/analysts/{id}/patients.")
    @GetMapping("/{patientId}/analysts")
    public List<AnalystDTO> listAnalysts(@PathVariable UUID patientId) {
        log.info("GET /api/patients/{}/analysts", patientId);
        return analystService.findAllForPatient(patientId);
    }

    @Operation(
            summary = "Recupera un paziente",
            description = "Consentito a qualsiasi analista: sono dati anagrafici, non clinici.")
    @GetMapping("/{id}")
    public PatientDTO get(@PathVariable UUID id) {
        log.info("GET /api/patients/{}", id);
        return patientService.findById(id);
    }

    @Operation(
            summary = "Crea un paziente",
            description = "Lo prende automaticamente in carico all'analista chiamante, creando "
                    + "l'assegnazione. Il titolo di studio si indica con il solo codice.")
    @PostMapping
    public ResponseEntity<PatientDTO> create(@Valid @RequestBody PatientDTO dto) {
        log.info("POST /api/patients");
        PatientDTO created = patientService.create(dto);
        return ResponseEntity.created(URI.create("/api/patients/" + created.getId())).body(created);
    }

    @Operation(
            summary = "Modifica un paziente",
            description = "Riservato a chi lo ha in carico: 404 se il paziente non e' assegnato "
                    + "al chiamante, anche se la lettura era consentita.")
    @PutMapping("/{id}")
    public PatientDTO update(@PathVariable UUID id, @Valid @RequestBody PatientDTO dto) {
        log.info("PUT /api/patients/{}", id);
        return patientService.update(id, dto);
    }

    @Operation(
            summary = "Elimina un paziente",
            description = "Lo elimina del tutto, non solo la propria assegnazione. Con lui "
                    + "spariscono assegnazioni, diagnosi, percorsi ed esecuzioni, comprese "
                    + "quelle di un eventuale collega che lo seguiva.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("DELETE /api/patients/{}", id);
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // --- Diagnoses of a patient --------------------------------------------------------

    @Operation(
            summary = "Elenca le diagnosi di un paziente",
            description = "Solo quelle redatte dal chiamante: un collega che segue lo stesso "
                    + "paziente tiene uno storico separato.")
    @GetMapping("/{patientId}/diagnoses")
    public List<DiagnosisDTO> listDiagnoses(@PathVariable UUID patientId) {
        log.info("GET /api/patients/{}/diagnoses", patientId);
        return diagnosisService.findAllForPatient(patientId);
    }

    @Operation(
            summary = "Inserisce una diagnosi",
            description = "Registrata sull'assegnazione del chiamante, non sul solo paziente.")
    @PostMapping("/{patientId}/diagnoses")
    public ResponseEntity<DiagnosisDTO> createDiagnosis(
            @PathVariable UUID patientId, @Valid @RequestBody DiagnosisDTO dto) {
        log.info("POST /api/patients/{}/diagnoses data={}", patientId, dto.getDiagnosisDate());
        DiagnosisDTO created = diagnosisService.create(patientId, dto);
        return ResponseEntity.created(URI.create("/api/diagnoses/" + created.getId())).body(created);
    }

    // --- Flows assigned to a patient ----------------------------------------------------

    @Operation(
            summary = "Elenca i percorsi assegnati a un paziente dal chiamante",
            description = "Ogni assegnazione riporta il flow senza flowJson.")
    @GetMapping("/{patientId}/paths")
    public List<PatientPathDTO> listPaths(@PathVariable UUID patientId) {
        log.info("GET /api/patients/{}/paths", patientId);
        return patientPathService.findAllForPatient(patientId);
    }

    /** Returns the generated unique code -- the analyst hands it to the patient. */
    @Operation(
            summary = "Assegna un flow a un paziente",
            description = "Il flow si indica per id: {\"flow\": {\"id\": \"...\"}}, e deve essere "
                    + "uno dei propri: quello di un collega risponde 404. Restituisce il codice "
                    + "univoco generato, da consegnare al paziente. 409 se lo stesso flow e' "
                    + "gia' assegnato: due codici per un flow spezzerebbero la telemetria.")
    @PostMapping("/{patientId}/paths")
    public ResponseEntity<PatientPathDTO> assignPath(
            @PathVariable UUID patientId, @Valid @RequestBody PatientPathDTO dto) {
        log.info("POST /api/patients/{}/paths flowId={}", patientId, dto.getFlow().getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientPathService.assign(patientId, dto));
    }

    /** {@code pathId} is the association's id, the one returned as {@code id} above. */
    @Operation(
            summary = "Rimuove un percorso assegnato",
            description = "pathId e' l'id dell'assegnazione, non quello del flow. Le esecuzioni "
                    + "registrate su quel codice vengono eliminate con essa; il flow resta.")
    @DeleteMapping("/{patientId}/paths/{pathId}")
    public ResponseEntity<Void> removePath(@PathVariable UUID patientId, @PathVariable UUID pathId) {
        log.info("DELETE /api/patients/{}/paths/{}", patientId, pathId);
        patientPathService.remove(patientId, pathId);
        return ResponseEntity.noContent().build();
    }
}
