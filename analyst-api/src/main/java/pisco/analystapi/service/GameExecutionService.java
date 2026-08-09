package pisco.analystapi.service;

import java.util.List;
import java.util.UUID;
import pisco.analystapi.model.dto.GameExecutionDTO;

public interface GameExecutionService {

    // --- Written by the patient's client, unauthenticated -----------------------------

    /** Records a run that already happened, telemetry and all. */
    GameExecutionDTO create(GameExecutionDTO dto);

    /** Replaces a recorded run, including its answers. */
    GameExecutionDTO update(UUID id, GameExecutionDTO dto);

    // --- Read and managed by the analyst ------------------------------------------------

    List<GameExecutionDTO> findAll(UUID patientId);

    GameExecutionDTO findById(UUID id);

    List<GameExecutionDTO> findByUniqueCode(String uniqueCode);

    void delete(UUID id);
}
