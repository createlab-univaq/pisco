package pisco.analystapi.service.impl;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.config.security.SecurityUtils;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.dto.DiagnosisDTO;
import pisco.analystapi.model.entity.Diagnosis;
import pisco.analystapi.model.entity.Patient;
import pisco.analystapi.model.mapper.DiagnosisMapper;
import pisco.analystapi.model.repository.DiagnosisRepository;
import pisco.analystapi.service.DiagnosisService;
import pisco.analystapi.service.PatientService;

/** The diagnosis text, notes and medications are clinical data and are never logged. */
@Service
@RequiredArgsConstructor
@Slf4j
public class DiagnosisServiceImpl implements DiagnosisService {

    private final DiagnosisRepository repository;
    private final PatientService patientService;
    private final DiagnosisMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<DiagnosisDTO> findAllForPatient(UUID patientId) {
        // Resolve the patient first so an unknown or foreign id is a 404 rather than an
        // empty list, which would read as "this patient has no diagnoses".
        patientService.requireOwned(patientId);

        List<Diagnosis> diagnoses = repository
                .findAllByPatientIdAndPatientAnalystIdOrderByDiagnosisDateDesc(
                        patientId, SecurityUtils.currentAnalystId());
        log.info("Storico diagnosi patientId={} risultati={}", patientId, diagnoses.size());
        return mapper.toDto(diagnoses);
    }

    @Override
    @Transactional(readOnly = true)
    public DiagnosisDTO findById(UUID id) {
        return mapper.toDto(requireOwned(id));
    }

    @Override
    @Transactional
    public DiagnosisDTO create(UUID patientId, DiagnosisDTO dto) {
        Patient patient = patientService.requireOwned(patientId);

        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setPatient(patient);
        mapper.updateEntity(diagnosis, dto);

        Diagnosis saved = repository.saveAndFlush(diagnosis);
        log.info("Diagnosi creata id={} patientId={} data={}",
                saved.getId(), patientId, saved.getDiagnosisDate());
        return mapper.toDto(saved);
    }

    @Override
    @Transactional
    public DiagnosisDTO update(UUID id, DiagnosisDTO dto) {
        Diagnosis diagnosis = requireOwned(id);
        mapper.updateEntity(diagnosis, dto);
        log.info("Diagnosi aggiornata id={}", id);
        return mapper.toDto(diagnosis);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        repository.delete(requireOwned(id));
        log.info("Diagnosi eliminata id={}", id);
    }

    /** Ownership travels through the patient -- a diagnosis has no analyst of its own. */
    private Diagnosis requireOwned(UUID id) {
        UUID analystId = SecurityUtils.currentAnalystId();
        return repository.findByIdAndPatientAnalystId(id, analystId)
                .orElseThrow(() -> {
                    log.warn("Diagnosi {} non accessibile per analystId={}", id, analystId);
                    return NotFoundException.of("Diagnosi", id);
                });
    }
}
