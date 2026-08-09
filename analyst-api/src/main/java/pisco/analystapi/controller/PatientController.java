package pisco.analystapi.controller;

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
import pisco.analystapi.model.dto.DiagnosisDTO;
import pisco.analystapi.model.dto.PatientDTO;
import pisco.analystapi.model.dto.PatientPathDTO;
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
public class PatientController {

    private final PatientService patientService;
    private final DiagnosisService diagnosisService;
    private final PatientPathService patientPathService;

    // --- Patients ---------------------------------------------------------------------

    /** Only the calling analyst's patients, enforced in the query itself. */
    @GetMapping
    public List<PatientDTO> list() {
        log.info("GET /api/patients");
        return patientService.findAll();
    }

    @GetMapping("/{id}")
    public PatientDTO get(@PathVariable UUID id) {
        log.info("GET /api/patients/{}", id);
        return patientService.findById(id);
    }

    @PostMapping
    public ResponseEntity<PatientDTO> create(@Valid @RequestBody PatientDTO dto) {
        log.info("POST /api/patients educationLevel={}", dto.getEducationLevelCode());
        PatientDTO created = patientService.create(dto);
        return ResponseEntity.created(URI.create("/api/patients/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public PatientDTO update(@PathVariable UUID id, @Valid @RequestBody PatientDTO dto) {
        log.info("PUT /api/patients/{} educationLevel={}", id, dto.getEducationLevelCode());
        return patientService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("DELETE /api/patients/{}", id);
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // --- Diagnoses of a patient --------------------------------------------------------

    @GetMapping("/{patientId}/diagnoses")
    public List<DiagnosisDTO> listDiagnoses(@PathVariable UUID patientId) {
        log.info("GET /api/patients/{}/diagnoses", patientId);
        return diagnosisService.findAllForPatient(patientId);
    }

    @PostMapping("/{patientId}/diagnoses")
    public ResponseEntity<DiagnosisDTO> createDiagnosis(
            @PathVariable UUID patientId, @Valid @RequestBody DiagnosisDTO dto) {
        log.info("POST /api/patients/{}/diagnoses data={}", patientId, dto.getDiagnosisDate());
        DiagnosisDTO created = diagnosisService.create(patientId, dto);
        return ResponseEntity.created(URI.create("/api/diagnoses/" + created.getId())).body(created);
    }

    // --- Polyglot paths assigned to a patient -------------------------------------------

    @GetMapping("/{patientId}/paths")
    public List<PatientPathDTO> listPaths(@PathVariable UUID patientId) {
        log.info("GET /api/patients/{}/paths", patientId);
        return patientPathService.findAllForPatient(patientId);
    }

    /** Returns the generated unique code -- the analyst hands it to the patient. */
    @PostMapping("/{patientId}/paths")
    public ResponseEntity<PatientPathDTO> assignPath(
            @PathVariable UUID patientId, @Valid @RequestBody PatientPathDTO dto) {
        log.info("POST /api/patients/{}/paths polyglotPathId={}", patientId, dto.getPolyglotPathId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientPathService.assign(patientId, dto));
    }

    /** {@code pathId} is the association's id, the one returned as {@code id} above. */
    @DeleteMapping("/{patientId}/paths/{pathId}")
    public ResponseEntity<Void> removePath(@PathVariable UUID patientId, @PathVariable UUID pathId) {
        log.info("DELETE /api/patients/{}/paths/{}", patientId, pathId);
        patientPathService.remove(patientId, pathId);
        return ResponseEntity.noContent().build();
    }
}
