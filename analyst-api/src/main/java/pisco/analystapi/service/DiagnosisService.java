package pisco.analystapi.service;

import java.util.List;
import java.util.UUID;
import pisco.analystapi.model.dto.DiagnosisDTO;

public interface DiagnosisService {

    List<DiagnosisDTO> findAllForPatient(UUID patientId);

    DiagnosisDTO findById(UUID id);

    DiagnosisDTO create(UUID patientId, DiagnosisDTO dto);

    DiagnosisDTO update(UUID id, DiagnosisDTO dto);

    void delete(UUID id);
}
