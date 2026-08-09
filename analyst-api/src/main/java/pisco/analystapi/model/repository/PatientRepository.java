package pisco.analystapi.model.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, UUID> {

    /**
     * Ownership is part of the query, not a check after the fact: a patient belonging to
     * another analyst comes back empty and turns into a 404, which tells the caller nothing.
     */
    Optional<Patient> findByIdAndAnalystId(UUID id, UUID analystId);

    List<Patient> findAllByAnalystIdOrderByLastNameAscFirstNameAsc(UUID analystId);

    boolean existsByAnalystId(UUID analystId);
}
