package pisco.analystapi.service.impl;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.common.LogUtils;
import pisco.analystapi.config.security.SecurityUtils;
import pisco.analystapi.exception.ConflictException;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.dto.GameExecutionDTO;
import pisco.analystapi.model.dto.GameExecutionNodeDTO;
import pisco.analystapi.model.dto.StartExecutionDTO;
import pisco.analystapi.model.entity.GameExecution;
import pisco.analystapi.model.entity.GameExecutionNode;
import pisco.analystapi.model.entity.PatientPath;
import pisco.analystapi.model.mapper.GameExecutionMapper;
import pisco.analystapi.model.mapper.GameExecutionNodeMapper;
import pisco.analystapi.model.repository.GameExecutionRepository;
import pisco.analystapi.service.GameExecutionService;
import pisco.analystapi.service.PatientPathService;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameExecutionServiceImpl implements GameExecutionService {

    private final GameExecutionRepository repository;
    private final PatientPathService patientPathService;
    private final GameExecutionMapper mapper;
    private final GameExecutionNodeMapper nodeMapper;

    // --- Written by the patient's client, unauthenticated -----------------------------

    @Override
    @Transactional
    public GameExecutionDTO start(StartExecutionDTO dto) {
        PatientPath patientPath = patientPathService.requireByCode(dto.getUniqueCode());

        GameExecution execution = new GameExecution();
        execution.setPatientPath(patientPath);
        execution.setStartedAt(Instant.now());

        GameExecution saved = repository.saveAndFlush(execution);
        log.info("Esecuzione avviata id={} patientPathId={} codice={}",
                saved.getId(), patientPath.getId(), LogUtils.maskCode(dto.getUniqueCode()));
        return mapper.toDto(saved);
    }

    @Override
    @Transactional
    public GameExecutionNodeDTO addNode(UUID executionId, GameExecutionNodeDTO dto) {
        return addNodes(executionId, List.of(dto)).getFirst();
    }

    /**
     * Batch insert. A session produces one row per node traversed, and the client has no
     * reason to pay a round-trip for each one.
     */
    @Override
    @Transactional
    public List<GameExecutionNodeDTO> addNodes(UUID executionId, List<GameExecutionNodeDTO> dtos) {
        GameExecution execution = requireOpen(executionId);

        List<GameExecutionNode> nodes = new ArrayList<>(dtos.size());
        for (GameExecutionNodeDTO dto : dtos) {
            GameExecutionNode node = new GameExecutionNode();
            nodeMapper.updateEntity(node, dto);
            execution.addNode(node);
            nodes.add(node);
        }
        // flush(), not save()/saveAndFlush(): the execution was loaded in this transaction
        // and is already managed, so save() would route to em.merge(). Merge cascades by
        // persisting *copies* of the new nodes, leaving the instances above transient with
        // null ids -- which is exactly what the response would then carry. A plain flush
        // cascades PERSIST onto these instances and assigns their ids in place.
        repository.flush();

        log.info("Telemetria salvata executionId={} nodi={} totaleSessione={}",
                executionId, nodes.size(), execution.getNodes().size());
        return nodeMapper.toDto(nodes);
    }

    @Override
    @Transactional
    public GameExecutionDTO finish(UUID executionId) {
        GameExecution execution = requireOpen(executionId);
        execution.setFinishedAt(Instant.now());
        log.info("Esecuzione conclusa id={} nodi={} durata={}",
                executionId,
                execution.getNodes().size(),
                Duration.between(execution.getStartedAt(), execution.getFinishedAt()));
        return mapper.toDto(execution);
    }

    // --- Read by the analyst -----------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<GameExecutionDTO> findAll(UUID patientId) {
        UUID analystId = SecurityUtils.currentAnalystId();
        List<GameExecution> executions = repository.findForAnalyst(analystId, patientId);
        log.info("Elenco esecuzioni analystId={} patientId={} risultati={}",
                analystId, patientId, executions.size());
        return mapper.toDto(executions);
    }

    @Override
    @Transactional(readOnly = true)
    public GameExecutionDTO findById(UUID id) {
        UUID analystId = SecurityUtils.currentAnalystId();
        GameExecution execution = repository.findByIdForAnalyst(id, analystId)
                .orElseThrow(() -> {
                    log.warn("Esecuzione {} non accessibile per analystId={}", id, analystId);
                    return NotFoundException.of("Esecuzione", id);
                });
        log.info("Dettaglio esecuzione id={} nodi={}", id, execution.getNodes().size());
        return mapper.toDetailDto(execution);
    }

    /**
     * Scoped to the analyst even though the code is a credential elsewhere: the patient's
     * client writes telemetry, it never needs to read the history back.
     */
    @Override
    @Transactional(readOnly = true)
    public List<GameExecutionDTO> findByUniqueCode(String uniqueCode) {
        List<GameExecution> executions =
                repository.findByUniqueCodeForAnalyst(uniqueCode, SecurityUtils.currentAnalystId());
        log.info("Esecuzioni per codice={} risultati={}",
                LogUtils.maskCode(uniqueCode), executions.size());
        return mapper.toDto(executions);
    }

    private GameExecution requireOpen(UUID executionId) {
        // Unauthenticated path: the execution id is an unguessable UUID handed back by
        // start(), so it is what stands in for a credential here.
        GameExecution execution = repository.findById(executionId)
                .orElseThrow(() -> {
                    log.warn("Esecuzione {} inesistente", executionId);
                    return NotFoundException.of("Esecuzione", executionId);
                });

        if (execution.getFinishedAt() != null) {
            log.warn("Scrittura rifiutata: esecuzione {} conclusa il {}",
                    executionId, execution.getFinishedAt());
            throw new ConflictException("Esecuzione gia' conclusa: " + executionId);
        }
        return execution;
    }
}
