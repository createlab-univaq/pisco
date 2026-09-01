package pisco.analystapi.service.impl;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.common.LogUtils;
import pisco.analystapi.exception.ConflictException;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.dto.PatientPathDTO;
import pisco.analystapi.model.dto.ResolvedPathDTO;
import pisco.analystapi.model.entity.AnalystPatient;
import pisco.analystapi.model.entity.Flow;
import pisco.analystapi.model.entity.PatientPath;
import pisco.analystapi.model.mapper.FlowMapper;
import pisco.analystapi.model.mapper.PatientPathMapper;
import pisco.analystapi.model.repository.PatientPathRepository;
import pisco.analystapi.service.AnalystPatientService;
import pisco.analystapi.service.FlowService;
import pisco.analystapi.service.PatientPathService;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientPathServiceImpl implements PatientPathService {

    private final PatientPathRepository repository;
    private final AnalystPatientService analystPatientService;
    private final FlowService flowService;
    private final PatientPathMapper mapper;
    private final FlowMapper flowMapper;
    private final UniqueCodeGenerator codeGenerator;

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
        // Only the author's own flows: an id belonging to a colleague is a 404 here too.
        Flow flow = flowService.requireOwned(dto.getFlow().getId());

        // Re-assigning the same flow is a conflict rather than a second code: two live
        // codes for one flow would split that patient's telemetry across both.
        if (repository.existsByAnalystPatientIdAndFlowId(link.getId(), flow.getId())) {
            log.warn("Assegnazione rifiutata: flow {} gia' assegnato a patientId={}",
                    flow.getId(), patientId);
            throw new ConflictException("Flow gia' assegnato a questo paziente: " + flow.getId());
        }

        PatientPath patientPath = new PatientPath();
        mapper.updateEntity(patientPath, dto);
        patientPath.setAnalystPatient(link);
        patientPath.setFlow(flow);
        patientPath.setUniqueCode(codeGenerator.generate());
        patientPath.setAssignedAt(Instant.now());

        PatientPath saved = repository.saveAndFlush(patientPath);
        log.info("Percorso assegnato id={} patientId={} flowId={} codice={}",
                saved.getId(), patientId, flow.getId(),
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
        log.info("Codice risolto patientPathId={} flowId={}",
                patientPath.getId(), patientPath.getFlow().getId());

        // Ids and the flow's identity only, deliberately: this response is served without
        // a token, so it carries neither the patient's details nor the flow's structure.
        return new ResolvedPathDTO(
                patientPath.getUniqueCode(),
                patientPath.getId(),
                patientPath.getAnalystPatient().getPatient().getId(),
                flowMapper.toDto(patientPath.getFlow()));
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
