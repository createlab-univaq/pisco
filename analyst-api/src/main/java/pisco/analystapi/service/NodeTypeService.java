package pisco.analystapi.service;

import java.util.List;
import pisco.analystapi.model.dto.NodeTypeDTO;
import pisco.analystapi.model.entity.NodeType;

public interface NodeTypeService {

    List<NodeTypeDTO> findAll();

    /**
     * The lookup row for a Polyglot type string, inserting it if this is the first time
     * the type has been seen. Registering rather than rejecting is deliberate: the types
     * are Polyglot's to define, and a run must not lose telemetry because the game gained
     * a node kind this service has never heard of.
     */
    NodeType resolveOrRegister(String label);
}
