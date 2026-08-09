package pisco.analystapi.model.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.NodeType;

public interface NodeTypeRepository extends JpaRepository<NodeType, UUID> {

    Optional<NodeType> findByLabel(String label);

    List<NodeType> findAllByOrderByLabelAsc();
}
