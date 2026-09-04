package pisco.analystapi.service.impl;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.config.security.SecurityUtils;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.entity.AnalystPatient;
import pisco.analystapi.model.entity.Patient;
import pisco.analystapi.model.repository.AnalystPatientRepository;
import pisco.analystapi.model.repository.AnalystRepository;
import pisco.analystapi.service.AnalystPatientService;

/** Log lines carry ids only -- a patient's name and age are personal data. */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnalystPatientServiceImpl implements AnalystPatientService {

    private final AnalystPatientRepository repository;
    private final AnalystRepository analystRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalystPatient requireLink(UUID patientId) {
        UUID analystId = SecurityUtils.currentAnalystId();
        return repository.findByAnalystIdAndPatientId(analystId, patientId)
                .orElseThrow(() -> {
                    // Covers both "does not exist" and "followed by someone else": the
                    // caller cannot tell them apart, but the log can.
                    log.warn("Paziente {} non in carico all'analista {}", patientId, analystId);
                    return NotFoundException.of("Paziente", patientId);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public void assertLinked(UUID patientId) {
        UUID analystId = SecurityUtils.currentAnalystId();
        if (!repository.existsByAnalystIdAndPatientId(analystId, patientId)) {
            log.warn("Paziente {} non in carico all'analista {}", patientId, analystId);
            throw NotFoundException.of("Paziente", patientId);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnalystPatient> findLinksForAnalyst(UUID analystId) {
        return repository.findAllByAnalystIdOrderByPatientLastNameAscPatientFirstNameAsc(analystId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnalystPatient> findLinksForPatient(UUID patientId) {
        return repository.findAllByPatientIdOrderByAnalystLastNameAscAnalystFirstNameAsc(patientId);
    }

    @Override
    @Transactional
    public AnalystPatient assignToCurrentAnalyst(Patient patient) {
        UUID analystId = SecurityUtils.currentAnalystId();
        // getReferenceById avoids loading the analyst just to set a foreign key.
        AnalystPatient link =
                new AnalystPatient(analystRepository.getReferenceById(analystId), patient);

        AnalystPatient saved = repository.saveAndFlush(link);
        log.info("Paziente {} preso in carico assegnazione={} analystId={}",
                patient.getId(), saved.getId(), analystId);
        return saved;
    }
}
