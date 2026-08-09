package pisco.analystapi.model.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.Diagnosis;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, UUID> {

    /** Ownership travels through the patient: the analyst never appears on the diagnosis. */
    Optional<Diagnosis> findByIdAndPatientAnalystId(UUID id, UUID analystId);

    List<Diagnosis> findAllByPatientIdAndPatientAnalystIdOrderByDiagnosisDateDesc(
            UUID patientId, UUID analystId);
}
