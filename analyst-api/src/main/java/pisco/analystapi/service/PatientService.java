package pisco.analystapi.service;

import java.util.List;
import java.util.UUID;
import pisco.analystapi.model.dto.PatientDTO;
import pisco.analystapi.model.entity.Patient;

public interface PatientService {

    List<PatientDTO> findAll();

    PatientDTO findById(UUID id);

    PatientDTO create(PatientDTO dto);

    PatientDTO update(UUID id, PatientDTO dto);

    void delete(UUID id);

    /**
     * The single point where a patient is fetched for the caller, entity and all.
     * Diagnoses and paths go through it too, so ownership cannot be forgotten in one
     * branch. Throws NotFoundException when the patient belongs to someone else.
     */
    Patient requireOwned(UUID id);
}
