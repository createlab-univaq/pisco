package pisco.analystapi.service.impl;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import pisco.analystapi.config.security.SecurityUtils;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.dto.PatientDTO;
import pisco.analystapi.model.entity.EducationLevel;
import pisco.analystapi.model.entity.Patient;
import pisco.analystapi.model.mapper.PatientMapper;
import pisco.analystapi.model.repository.AnalystRepository;
import pisco.analystapi.model.repository.EducationLevelRepository;
import pisco.analystapi.model.repository.PatientRepository;
import pisco.analystapi.service.PatientService;

/** Log lines carry ids only -- a patient's name and age are personal data. */
@Service
@RequiredArgsConstructor
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientRepository repository;
    private final AnalystRepository analystRepository;
    private final EducationLevelRepository educationLevelRepository;
    private final PatientMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<PatientDTO> findAll() {
        UUID analystId = SecurityUtils.currentAnalystId();
        List<Patient> patients = repository.findAllByAnalystIdOrderByLastNameAscFirstNameAsc(analystId);
        log.info("Elenco pazienti analystId={} risultati={}", analystId, patients.size());
        return mapper.toDto(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientDTO findById(UUID id) {
        return mapper.toDto(requireOwned(id));
    }

    @Override
    @Transactional
    public PatientDTO create(PatientDTO dto) {
        UUID analystId = SecurityUtils.currentAnalystId();

        Patient patient = new Patient();
        // getReferenceById avoids loading the analyst just to set a foreign key.
        patient.setAnalyst(analystRepository.getReferenceById(analystId));
        mapper.updateEntity(patient, dto);
        patient.setEducationLevel(resolveEducationLevel(dto.getEducationLevelCode()));

        // saveAndFlush, not save: @CreationTimestamp and any DB-assigned value land at
        // insert time, which otherwise happens at commit -- after the DTO is built, so
        // the create response would carry a null createdAt.
        Patient saved = repository.saveAndFlush(patient);
        log.info("Paziente creato id={} analystId={}", saved.getId(), analystId);
        return mapper.toDto(saved);
    }

    @Override
    @Transactional
    public PatientDTO update(UUID id, PatientDTO dto) {
        Patient patient = requireOwned(id);
        mapper.updateEntity(patient, dto);
        patient.setEducationLevel(resolveEducationLevel(dto.getEducationLevelCode()));
        log.info("Paziente aggiornato id={}", id);
        return mapper.toDto(patient);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        // Diagnoses, assigned paths and their executions go with it -- those foreign keys
        // are declared ON DELETE CASCADE.
        repository.delete(requireOwned(id));
        log.info("Paziente eliminato id={} (diagnosi, percorsi ed esecuzioni in cascata)", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Patient requireOwned(UUID id) {
        UUID analystId = SecurityUtils.currentAnalystId();
        return repository.findByIdAndAnalystId(id, analystId)
                .orElseThrow(() -> {
                    // Covers both "does not exist" and "belongs to someone else": the
                    // caller cannot tell them apart, but the log can.
                    log.warn("Paziente {} non accessibile per analystId={}", id, analystId);
                    return NotFoundException.of("Paziente", id);
                });
    }

    private EducationLevel resolveEducationLevel(String code) {
        if (!StringUtils.hasText(code)) {
            return null;
        }
        return educationLevelRepository.findById(code)
                .orElseThrow(() -> {
                    log.warn("Titolo di studio sconosciuto: {}", code);
                    return NotFoundException.of("Titolo di studio", code);
                });
    }
}
