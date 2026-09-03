package pisco.analystapi.model.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pisco.analystapi.model.entity.Flow;

public interface FlowRepository extends JpaRepository<Flow, UUID> {

    /**
     * A flow is private to its author, so every read is scoped rather than filtered later.
     *
     * <p>JPQL rather than a derived name because the search spans two fields: derived, the
     * ownership check has to be repeated on both sides of the Or, and one wrong grouping
     * there returns another analyst's flows. Written out, the scope sits outside the group
     * where it cannot be misread. The {@code :search is null} branch lets one query serve
     * both the filtered and the unfiltered list, as findForAnalyst does for executions.
     */
    @Query("""
            select f from Flow f
            where f.analyst.id = :analystId
              and (:search is null
                   or lower(f.name) like lower(concat('%', :search, '%'))
                   or lower(f.description) like lower(concat('%', :search, '%')))
            order by f.name asc
            """)
    List<Flow> findForAnalyst(@Param("analystId") UUID analystId, @Param("search") String search);

    Optional<Flow> findByIdAndAnalystId(UUID id, UUID analystId);

    /** Backs the friendly 409 on uk_flows_name_analyst, ahead of the constraint itself. */
    boolean existsByAnalystIdAndName(UUID analystId, String name);

    boolean existsByAnalystIdAndNameAndIdNot(UUID analystId, String name, UUID id);
}
