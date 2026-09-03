package pisco.analystapi.model.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import pisco.analystapi.model.entity.Flow;

/**
 * The list read is composed from FlowSpecifications rather than declared here: the search
 * spans two fields, so as a derived name the ownership check would have to be repeated on
 * both sides of the Or, and one wrong grouping there returns another analyst's flows.
 */
public interface FlowRepository extends JpaRepository<Flow, UUID>, JpaSpecificationExecutor<Flow> {

    Optional<Flow> findByIdAndAnalystId(UUID id, UUID analystId);

    /** Backs the friendly 409 on uk_flows_name_analyst, ahead of the constraint itself. */
    boolean existsByAnalystIdAndName(UUID analystId, String name);

    boolean existsByAnalystIdAndNameAndIdNot(UUID analystId, String name, UUID id);
}
