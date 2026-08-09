package pisco.analystapi.model.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.Diagnosis;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, UUID> {

    /** Ownership travels through the assignment: the analyst is one hop away, not two. */
    Optional<Diagnosis> findByIdAndAnalystPatientAnalystId(UUID id, UUID analystId);

    /**
     * Takes the assignment id, which the caller has already had checked, so the analyst
     * does not need repeating here.
     */
    List<Diagnosis> findAllByAnalystPatientIdOrderByDiagnosisDateDesc(UUID analystPatientId);
}
