package pisco.analystapi.model.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pisco.analystapi.model.entity.GameExecution;

public interface GameExecutionRepository extends JpaRepository<GameExecution, UUID> {

    /**
     * Derived method names get unreadable three levels deep, so the scoped reads are
     * spelled out in JPQL. The optional patient filter is the {@code :patientId is null}
     * branch, which lets one query serve both the filtered and unfiltered list.
     */
    @Query("""
            select e from GameExecution e
            where e.patientPath.analystPatient.analyst.id = :analystId
              and (:patientId is null or e.patientPath.analystPatient.patient.id = :patientId)
            order by e.startedAt desc
            """)
    List<GameExecution> findForAnalyst(
            @Param("analystId") UUID analystId, @Param("patientId") UUID patientId);

    @Query("""
            select e from GameExecution e
            where e.id = :id and e.patientPath.analystPatient.analyst.id = :analystId
            """)
    Optional<GameExecution> findByIdForAnalyst(@Param("id") UUID id, @Param("analystId") UUID analystId);

    @Query("""
            select e from GameExecution e
            where e.patientPath.uniqueCode = :uniqueCode
              and e.patientPath.analystPatient.analyst.id = :analystId
            order by e.startedAt desc
            """)
    List<GameExecution> findByUniqueCodeForAnalyst(
            @Param("uniqueCode") String uniqueCode, @Param("analystId") UUID analystId);
}
