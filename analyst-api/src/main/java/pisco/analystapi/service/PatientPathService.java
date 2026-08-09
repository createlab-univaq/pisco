package pisco.analystapi.service;

import java.util.List;
import java.util.UUID;
import pisco.analystapi.model.dto.PatientPathDTO;
import pisco.analystapi.model.dto.ResolvedPathDTO;
import pisco.analystapi.model.entity.PatientPath;

public interface PatientPathService {

    List<PatientPathDTO> findAllForPatient(UUID patientId);

    PatientPathDTO assign(UUID patientId, PatientPathDTO dto);

    void remove(UUID patientId, UUID pathId);

    /** Unauthenticated: the code the patient was given is the only credential. */
    ResolvedPathDTO resolve(String uniqueCode);

    /** Used by the analytics side, which needs the association behind a code. */
    PatientPath requireByCode(String uniqueCode);
}
