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
import pisco.analystapi.model.entity.AnalystPatient;
import pisco.analystapi.model.entity.Diagnosis;
import pisco.analystapi.model.mapper.DiagnosisMapper;
import pisco.analystapi.model.repository.DiagnosisRepository;
import pisco.analystapi.service.AnalystPatientService;
import pisco.analystapi.service.DiagnosisService;

/** The diagnosis text, notes and medications are clinical data and are never logged. */
@Service
@RequiredArgsConstructor
@Slf4j
public class DiagnosisServiceImpl implements DiagnosisService {

    private final DiagnosisRepository repository;
    private final AnalystPatientService analystPatientService;
    private final DiagnosisMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<DiagnosisDTO> findAllForPatient(UUID patientId) {
        // Resolve the assignment first so an unknown or foreign id is a 404 rather than an
        // empty list, which would read as "this patient has no diagnoses".
        AnalystPatient link = analystPatientService.requireLink(patientId);

        // Scoped to the caller's own assignment: a colleague following the same patient
        // keeps a separate history, and neither sees the other's.
        List<Diagnosis> diagnoses =
                repository.findAllByAnalystPatientIdOrderByDiagnosisDateDesc(link.getId());
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
        AnalystPatient link = analystPatientService.requireLink(patientId);

        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setAnalystPatient(link);
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
        requireOwned(id);
        repository.deleteById(id);
        log.info("Diagnosi eliminata id={}", id);
    }

    /** Ownership travels through the assignment -- a diagnosis has no analyst of its own. */
    private Diagnosis requireOwned(UUID id) {
        UUID analystId = SecurityUtils.currentAnalystId();
        return repository.findByIdAndAnalystPatientAnalystId(id, analystId)
                .orElseThrow(() -> {
                    log.warn("Diagnosi {} non accessibile per analystId={}", id, analystId);
                    return NotFoundException.of("Diagnosi", id);
                });
    }
}
