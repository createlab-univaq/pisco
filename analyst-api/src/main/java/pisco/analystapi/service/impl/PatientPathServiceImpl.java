package pisco.analystapi.service.impl;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.client.PolyglotClient;
import pisco.analystapi.common.LogUtils;
import pisco.analystapi.exception.ConflictException;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.dto.PatientPathDTO;
import pisco.analystapi.model.dto.ResolvedPathDTO;
import pisco.analystapi.model.entity.AnalystPatient;
import pisco.analystapi.model.entity.PatientPath;
import pisco.analystapi.model.mapper.PatientPathMapper;
import pisco.analystapi.model.repository.PatientPathRepository;
import pisco.analystapi.service.AnalystPatientService;
import pisco.analystapi.service.PatientPathService;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientPathServiceImpl implements PatientPathService {

    private final PatientPathRepository repository;
    private final AnalystPatientService analystPatientService;
    private final PatientPathMapper mapper;
    private final UniqueCodeGenerator codeGenerator;
    private final PolyglotClient polyglotClient;

    @Override
    @Transactional(readOnly = true)
    public List<PatientPathDTO> findAllForPatient(UUID patientId) {
        AnalystPatient link = analystPatientService.requireLink(patientId);

        List<PatientPath> paths =
                repository.findAllByAnalystPatientIdOrderByAssignedAtDesc(link.getId());
        log.info("Percorsi assegnati patientId={} risultati={}", patientId, paths.size());
        return mapper.toDto(paths);
    }

    @Override
    @Transactional
    public PatientPathDTO assign(UUID patientId, PatientPathDTO dto) {
        AnalystPatient link = analystPatientService.requireLink(patientId);

        // Re-assigning the same path is a conflict rather than a second code: two live
        // codes for one path would split that patient's telemetry across both.
        if (repository.existsByAnalystPatientIdAndPolyglotPathId(
                link.getId(), dto.getPolyglotPathId())) {
            log.warn("Assegnazione rifiutata: percorso {} gia' assegnato a patientId={}",
                    dto.getPolyglotPathId(), patientId);
            throw new ConflictException(
                    "Percorso gia' assegnato a questo paziente: " + dto.getPolyglotPathId());
        }

        PatientPath patientPath = new PatientPath();
        mapper.updateEntity(patientPath, dto);
        patientPath.setAnalystPatient(link);
        patientPath.setUniqueCode(codeGenerator.generate());
        patientPath.setAssignedAt(Instant.now());

        PatientPath saved = repository.saveAndFlush(patientPath);
        log.info("Percorso assegnato id={} patientId={} polyglotPathId={} codice={}",
                saved.getId(), patientId, saved.getPolyglotPathId(),
                LogUtils.maskCode(saved.getUniqueCode()));
        return mapper.toDto(saved);
    }

    @Override
    @Transactional
    public void remove(UUID patientId, UUID pathId) {
        AnalystPatient link = analystPatientService.requireLink(patientId);
        PatientPath patientPath = repository.findByIdAndAnalystPatientId(pathId, link.getId())
                .orElseThrow(() -> {
                    log.warn("Percorso {} non accessibile per patientId={}", pathId, patientId);
                    return NotFoundException.of("Percorso assegnato", pathId);
                });

        // Executions recorded under this code go too -- the foreign key cascades.
        repository.delete(patientPath);
        log.info("Percorso rimosso id={} patientId={} (esecuzioni in cascata)", pathId, patientId);
    }

    @Override
    @Transactional(readOnly = true)
    public ResolvedPathDTO resolve(String uniqueCode) {
        PatientPath patientPath = requireByCode(uniqueCode);

        log.info("Codice risolto patientPathId={} polyglotPathId={}: fetch da Polyglot",
                patientPath.getId(), patientPath.getPolyglotPathId());
        Object path = polyglotClient.fetchPath(patientPath.getPolyglotPathId());

        // Ids only, deliberately: this response is served without a token, so it carries
        // nothing about who the patient is.
        return new ResolvedPathDTO(
                patientPath.getUniqueCode(),
                patientPath.getId(),
                patientPath.getAnalystPatient().getPatient().getId(),
                patientPath.getPolyglotPathId(),
                path);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientPath requireByCode(String uniqueCode) {
        // Deliberately not scoped to an analyst: this is the unauthenticated entry point.
        return repository.findByUniqueCode(uniqueCode)
                .orElseThrow(() -> {
                    // Worth a warn: a run of these is someone guessing at codes.
                    log.warn("Codice non valido: {}", LogUtils.maskCode(uniqueCode));
                    return new NotFoundException("Codice non valido");
                });
    }
}
