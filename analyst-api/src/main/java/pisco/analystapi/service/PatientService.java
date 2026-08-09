package pisco.analystapi.service;

import java.util.List;
import java.util.UUID;
import pisco.analystapi.model.dto.PatientDTO;

public interface PatientService {

    /** The whole register: browsing is open to any analyst, treating one is not. */
    List<PatientDTO> findAll();

    /** Only the patients assigned to the given analyst. */
    List<PatientDTO> findAllForAnalyst(UUID analystId);

    PatientDTO findById(UUID id);

    PatientDTO create(PatientDTO dto);

    PatientDTO update(UUID id, PatientDTO dto);

    void delete(UUID id);
}
