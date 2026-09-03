package pisco.analystapi.service.impl;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.common.LogUtils;
import pisco.analystapi.config.security.SecurityUtils;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.dto.GameAnswerDTO;
import pisco.analystapi.model.dto.GameExecutionDTO;
import pisco.analystapi.model.dto.GameExecutionNodeDTO;
import pisco.analystapi.model.entity.GameAnswer;
import pisco.analystapi.model.entity.GameExecution;
import pisco.analystapi.model.entity.GameExecutionNode;
import pisco.analystapi.model.entity.PatientPath;
import pisco.analystapi.model.mapper.GameAnswerMapper;
import pisco.analystapi.model.mapper.GameExecutionMapper;
import pisco.analystapi.model.mapper.GameExecutionNodeMapper;
import pisco.analystapi.model.repository.GameExecutionRepository;
import pisco.analystapi.service.GameExecutionService;
import pisco.analystapi.service.PatientPathService;

/**
 * The game runs elsewhere; this service only records what it reports. Nothing here is
 * measured server-side, so there is no open/closed state to keep -- an execution is an
 * ordinary record that arrives whole.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameExecutionServiceImpl implements GameExecutionService {

    private final GameExecutionRepository repository;
    private final PatientPathService patientPathService;
    private final GameExecutionMapper mapper;
    private final GameExecutionNodeMapper nodeMapper;
    private final GameAnswerMapper answerMapper;

    // --- Written by the patient's client, unauthenticated -----------------------------

    @Override
    @Transactional
    public GameExecutionDTO create(GameExecutionDTO dto) {
        PatientPath patientPath = patientPathService.requireByCode(dto.getFlowCode());

        GameExecution execution = new GameExecution();
        mapper.updateEntity(execution, dto);
        execution.setPatientPath(patientPath);
        addNodes(execution, dto.getNodes());

        GameExecution saved = repository.saveAndFlush(execution);
        log.info("Esecuzione registrata id={} patientPathId={} codice={} nodi={}",
                saved.getId(), patientPath.getId(),
                LogUtils.maskCode(dto.getFlowCode()), saved.getNodes().size());
        return mapper.toDetailDto(saved);
    }

    /** Order comes from the arrays themselves: the payload carries no sequence numbers. */
    private void addNodes(GameExecution execution, List<GameExecutionNodeDTO> dtos) {
        if (dtos == null) {
            return;
        }
        for (GameExecutionNodeDTO nodeDto : dtos) {
            GameExecutionNode node = new GameExecutionNode();
            nodeMapper.updateEntity(node, nodeDto);
            execution.addNode(node);

            if (nodeDto.getAnswers() != null) {
                for (GameAnswerDTO answerDto : nodeDto.getAnswers()) {
                    GameAnswer answer = new GameAnswer();
                    answerMapper.updateEntity(answer, answerDto);
                    node.addAnswer(answer);
                }
            }
        }
    }

    // --- Read and managed by the analyst ------------------------------------------------

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
        GameExecution execution = requireOwned(id);
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

    @Override
    @Transactional
    public void delete(UUID id) {
        // Nodes and their answers go with it -- the foreign keys cascade.
        requireOwned(id);
        repository.deleteById(id);
        log.info("Esecuzione eliminata id={} (risposte in cascata)", id);
    }

    private GameExecution requireOwned(UUID id) {
        UUID analystId = SecurityUtils.currentAnalystId();
        return repository.findByIdForAnalyst(id, analystId)
                .orElseThrow(() -> {
                    log.warn("Esecuzione {} non accessibile per analystId={}", id, analystId);
                    return NotFoundException.of("Esecuzione", id);
                });
    }
}
