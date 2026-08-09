package pisco.analystapi.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.common.LogUtils;
import pisco.analystapi.model.dto.GameExecutionDTO;
import pisco.analystapi.model.dto.GameExecutionNodeDTO;
import pisco.analystapi.model.dto.StartExecutionDTO;
import pisco.analystapi.service.GameExecutionService;

@RestController
@RequestMapping("/api/game-executions")
@RequiredArgsConstructor
@Slf4j
public class GameExecutionController {

    private final GameExecutionService service;

    // --- Unauthenticated: called by the patient's client ------------------------------

    /** Opens a run from a unique code and returns the id the telemetry posts against. */
    @PostMapping
    public ResponseEntity<GameExecutionDTO> start(@Valid @RequestBody StartExecutionDTO dto) {
        log.info("POST /api/game-executions uniqueCode={}", LogUtils.maskCode(dto.getUniqueCode()));
        return ResponseEntity.status(HttpStatus.CREATED).body(service.start(dto));
    }

    @PostMapping("/{executionId}/nodes")
    public ResponseEntity<GameExecutionNodeDTO> addNode(
            @PathVariable UUID executionId, @Valid @RequestBody GameExecutionNodeDTO dto) {
        log.info("POST /api/game-executions/{}/nodes nodeType={} sequenza={}",
                executionId, dto.getNodeType(), dto.getSequenceNumber());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addNode(executionId, dto));
    }

    /** Whole-session variant, so a run is one request rather than one per node. */
    @PostMapping("/{executionId}/nodes/batch")
    public ResponseEntity<List<GameExecutionNodeDTO>> addNodes(
            @PathVariable UUID executionId, @Valid @RequestBody List<GameExecutionNodeDTO> dtos) {
        log.info("POST /api/game-executions/{}/nodes/batch nodi={}", executionId, dtos.size());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addNodes(executionId, dtos));
    }

    @PostMapping("/{executionId}/finish")
    public GameExecutionDTO finish(@PathVariable UUID executionId) {
        log.info("POST /api/game-executions/{}/finish", executionId);
        return service.finish(executionId);
    }

    // --- Analyst-only reads -----------------------------------------------------------

    @GetMapping
    public List<GameExecutionDTO> list(@RequestParam(required = false) UUID patientId) {
        log.info("GET /api/game-executions patientId={}", patientId);
        return service.findAll(patientId);
    }

    /** Includes every node traversed, ordered by sequence number. */
    @GetMapping("/{id}")
    public GameExecutionDTO get(@PathVariable UUID id) {
        log.info("GET /api/game-executions/{}", id);
        return service.findById(id);
    }

    @GetMapping("/by-code/{uniqueCode}")
    public List<GameExecutionDTO> listByCode(@PathVariable String uniqueCode) {
        log.info("GET /api/game-executions/by-code/{}", LogUtils.maskCode(uniqueCode));
        return service.findByUniqueCode(uniqueCode);
    }
}
