package pisco.analystapi.service;

import java.util.List;
import java.util.UUID;
import pisco.analystapi.model.entity.AnalystPatient;
import pisco.analystapi.model.entity.Patient;

public interface AnalystPatientService {

    /**
     * The caller's own assignment for a patient. Everything clinical goes through it, so
     * ownership cannot be forgotten in one branch -- browsing the patient register is
     * open, but reading or writing a case is not.
     * Throws NotFoundException when no assignment links the caller to that patient.
     */
    AnalystPatient requireLink(UUID patientId);

    /** Assignments held by one analyst, ordered by the patient's name. */
    List<AnalystPatient> findLinksForAnalyst(UUID analystId);

    /** The mirror: assignments covering one patient, ordered by the analyst's name. */
    List<AnalystPatient> findLinksForPatient(UUID patientId);

    /** Takes a freshly created patient into the calling analyst's care. */
    AnalystPatient assignToCurrentAnalyst(Patient patient);
}
