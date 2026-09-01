package pisco.analystapi.model.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.Flow;

public interface FlowRepository extends JpaRepository<Flow, UUID> {

    /** A flow is private to its author, so every read is scoped rather than filtered later. */
    List<Flow> findAllByAnalystIdOrderByNameAsc(UUID analystId);

    Optional<Flow> findByIdAndAnalystId(UUID id, UUID analystId);

    /** Backs the friendly 409 on uk_flows_name_analyst, ahead of the constraint itself. */
    boolean existsByAnalystIdAndName(UUID analystId, String name);

    boolean existsByAnalystIdAndNameAndIdNot(UUID analystId, String name, UUID id);
}
