package pisco.analystapi.model.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.AnalystPatient;

/**
 * Every analyst-scoped read starts here. The patient no longer knows who follows them,
 * so this repository is what turns "the caller" into the set of rows they may see.
 */
public interface AnalystPatientRepository extends JpaRepository<AnalystPatient, UUID> {

    /**
     * Answers "is this patient mine" and hands back the row that diagnoses and paths are
     * filed under, in one query.
     */
    Optional<AnalystPatient> findByAnalystIdAndPatientId(UUID analystId, UUID patientId);

    List<AnalystPatient> findAllByAnalystIdOrderByPatientLastNameAscPatientFirstNameAsc(
            UUID analystId);

    /** The mirror: who is following this patient. */
    List<AnalystPatient> findAllByPatientIdOrderByAnalystLastNameAscAnalystFirstNameAsc(
            UUID patientId);

    /** Guards analyst deletion: an analyst still holding assignments cannot be removed. */
    boolean existsByAnalystId(UUID analystId);
}
