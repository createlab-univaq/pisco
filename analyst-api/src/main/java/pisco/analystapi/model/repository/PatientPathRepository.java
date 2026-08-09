package pisco.analystapi.model.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.PatientPath;

public interface PatientPathRepository extends JpaRepository<PatientPath, UUID> {

    /** Used by the unauthenticated resolve endpoint, so it is deliberately not scoped. */
    Optional<PatientPath> findByUniqueCode(String uniqueCode);

    boolean existsByUniqueCode(String uniqueCode);

    List<PatientPath> findAllByPatientIdAndPatientAnalystIdOrderByAssignedAtDesc(
            UUID patientId, UUID analystId);

    Optional<PatientPath> findByIdAndPatientIdAndPatientAnalystId(
            UUID id, UUID patientId, UUID analystId);

    boolean existsByPatientIdAndPolyglotPathId(UUID patientId, String polyglotPathId);
}
