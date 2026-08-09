package pisco.analystapi.service.impl;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.dto.DegreeDTO;
import pisco.analystapi.model.dto.PatientDTO;
import pisco.analystapi.model.entity.AnalystPatient;
import pisco.analystapi.model.entity.Degree;
import pisco.analystapi.model.entity.Patient;
import pisco.analystapi.model.mapper.PatientMapper;
import pisco.analystapi.model.repository.DegreeRepository;
import pisco.analystapi.model.repository.PatientRepository;
import pisco.analystapi.service.AnalystPatientService;
import pisco.analystapi.service.PatientService;

/** Log lines carry ids only -- a patient's name and age are personal data. */
@Service
@RequiredArgsConstructor
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientRepository repository;
    private final AnalystPatientService analystPatientService;
    private final DegreeRepository degreeRepository;
    private final PatientMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<PatientDTO> findAll() {
        List<Patient> patients = repository.findAllByOrderByLastNameAscFirstNameAsc();
        log.info("Elenco pazienti (registro completo) risultati={}", patients.size());
        return mapper.toDto(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientDTO> findAllForAnalyst(UUID analystId) {
        List<Patient> patients = analystPatientService.findLinksForAnalyst(analystId).stream()
                .map(AnalystPatient::getPatient)
                .toList();
        log.info("Elenco pazienti analystId={} risultati={}", analystId, patients.size());
        return mapper.toDto(patients);
    }

    /** Anagraphic data only, so it is not gated on an assignment -- the register is open. */
    @Override
    @Transactional(readOnly = true)
    public PatientDTO findById(UUID id) {
        return mapper.toDto(require(id));
    }

    @Override
    @Transactional
    public PatientDTO create(PatientDTO dto) {
        Patient patient = new Patient();
        mapper.updateEntity(patient, dto);
        patient.setDegree(resolveDegree(dto.getDegree()));

        // saveAndFlush, not save: @CreationTimestamp and any DB-assigned value land at
        // insert time, which otherwise happens at commit -- after the DTO is built, so
        // the create response would carry a null createdAt.
        Patient saved = repository.saveAndFlush(patient);

        // A patient with no assignment would be invisible to every endpoint, including
        // the response's own author, so the two writes belong to one transaction.
        analystPatientService.assignToCurrentAnalyst(saved);

        log.info("Paziente creato id={}", saved.getId());
        return mapper.toDto(saved);
    }

    /** Writing is gated where reading is not: only an analyst treating the patient edits them. */
    @Override
    @Transactional
    public PatientDTO update(UUID id, PatientDTO dto) {
        Patient patient = analystPatientService.requireLink(id).getPatient();
        mapper.updateEntity(patient, dto);
        patient.setDegree(resolveDegree(dto.getDegree()));
        log.info("Paziente aggiornato id={}", id);
        return mapper.toDto(patient);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        // Deletes the patient outright, not just the caller's assignment (spec section 5).
        // Every assignment goes with them, and through those the diagnoses, assigned paths
        // and executions -- including another analyst's, if the patient was shared.
        repository.delete(analystPatientService.requireLink(id).getPatient());
        log.info("Paziente eliminato id={} (assegnazioni, diagnosi, percorsi ed esecuzioni in cascata)", id);
    }

    private Patient require(UUID id) {
        return repository.findById(id).orElseThrow(() -> {
            log.info("Paziente {} non trovato", id);
            return NotFoundException.of("Paziente", id);
        });
    }

    private Degree resolveDegree(DegreeDTO dto) {
        if (dto == null || !StringUtils.hasText(dto.getCode())) {
            return null;
        }
        return degreeRepository.findById(dto.getCode())
                .orElseThrow(() -> {
                    log.warn("Titolo di studio sconosciuto: {}", dto.getCode());
                    return NotFoundException.of("Titolo di studio", dto.getCode());
                });
    }
}
