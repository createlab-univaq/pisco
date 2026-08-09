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
import pisco.analystapi.model.entity.GameAnswer;
import pisco.analystapi.model.entity.GameExecution;
import pisco.analystapi.model.entity.PatientPath;
import pisco.analystapi.model.mapper.GameAnswerMapper;
import pisco.analystapi.model.mapper.GameExecutionMapper;
import pisco.analystapi.model.repository.GameExecutionRepository;
import pisco.analystapi.service.GameExecutionService;
import pisco.analystapi.service.NodeTypeService;
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
    private final NodeTypeService nodeTypeService;
    private final GameExecutionMapper mapper;
    private final GameAnswerMapper answerMapper;

    // --- Written by the patient's client, unauthenticated -----------------------------

    @Override
    @Transactional
    public GameExecutionDTO create(GameExecutionDTO dto) {
        PatientPath patientPath = patientPathService.requireByCode(dto.getUniqueCode());

        GameExecution execution = new GameExecution();
        mapper.updateEntity(execution, dto);
        execution.setPatientPath(patientPath);
        replaceAnswers(execution, dto.getAnswers());

        GameExecution saved = repository.saveAndFlush(execution);
        log.info("Esecuzione registrata id={} patientPathId={} codice={} risposte={}",
                saved.getId(), patientPath.getId(),
                LogUtils.maskCode(dto.getUniqueCode()), saved.getAnswers().size());
        return mapper.toDetailDto(saved);
    }

    @Override
    @Transactional
    public GameExecutionDTO update(UUID id, GameExecutionDTO dto) {
        // Unauthenticated path: the execution id is an unguessable UUID handed back by
        // create(), so it is what stands in for a credential here.
        GameExecution execution = require(id);
        mapper.updateEntity(execution, dto);
        replaceAnswers(execution, dto.getAnswers());

        // flush(), not save(): the execution was loaded in this transaction and is already
        // managed, so save() would route to em.merge() and persist *copies* of the new
        // answers, leaving these instances transient with null ids -- which is what the
        // response would then carry. A plain flush cascades onto them and assigns ids in
        // place, and drops the replaced rows via orphanRemoval.
        repository.flush();

        log.info("Esecuzione aggiornata id={} risposte={}", id, execution.getAnswers().size());
        return mapper.toDetailDto(execution);
    }

    /**
     * A re-recorded run replaces its telemetry rather than adding to it: the client is
     * reporting the whole session again, not a second half of it.
     */
    private void replaceAnswers(GameExecution execution, List<GameAnswerDTO> dtos) {
        execution.getAnswers().clear();
        if (dtos == null) {
            return;
        }
        for (GameAnswerDTO dto : dtos) {
            GameAnswer answer = new GameAnswer();
            answerMapper.updateEntity(answer, dto);
            answer.setNodeType(nodeTypeService.resolveOrRegister(dto.getNodeType().getLabel()));
            execution.addAnswer(answer);
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
        log.info("Dettaglio esecuzione id={} risposte={}", id, execution.getAnswers().size());
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
        // Answers go with it -- the foreign key cascades.
        repository.delete(requireOwned(id));
        log.info("Esecuzione eliminata id={} (risposte in cascata)", id);
    }

    /** Unscoped: used by the write path, which has no analyst behind it. */
    private GameExecution require(UUID id) {
        return repository.findById(id).orElseThrow(() -> {
            log.warn("Esecuzione {} inesistente", id);
            return NotFoundException.of("Esecuzione", id);
        });
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
