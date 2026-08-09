package pisco.analystapi.service;

import java.util.List;
import java.util.UUID;
import pisco.analystapi.model.dto.GameExecutionDTO;
import pisco.analystapi.model.dto.GameExecutionNodeDTO;
import pisco.analystapi.model.dto.StartExecutionDTO;

public interface GameExecutionService {

    // --- Written by the patient's client, unauthenticated -----------------------------

    GameExecutionDTO start(StartExecutionDTO dto);

    GameExecutionNodeDTO addNode(UUID executionId, GameExecutionNodeDTO dto);

    List<GameExecutionNodeDTO> addNodes(UUID executionId, List<GameExecutionNodeDTO> dtos);

    GameExecutionDTO finish(UUID executionId);

    // --- Read by the analyst -----------------------------------------------------------

    List<GameExecutionDTO> findAll(UUID patientId);

    GameExecutionDTO findById(UUID id);

    List<GameExecutionDTO> findByUniqueCode(String uniqueCode);
}
