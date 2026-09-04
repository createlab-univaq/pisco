package pisco.analystapi.service;

import java.util.List;
import java.util.UUID;

import pisco.analystapi.model.criteria.FlowCriteria;
import pisco.analystapi.model.dto.FlowDTO;
import pisco.analystapi.model.entity.Flow;

public interface FlowService {

    /**
     * The caller's own flows, without their graphs. A non-blank {@code search} keeps only
     * those whose name or description contains it, ignoring case; null or blank lists all.
     */
    List<FlowDTO> findAll(FlowCriteria criteria);

    /** The one place a flow comes back with its React Flow graph attached. */
    FlowDTO findById(UUID id);

    FlowDTO create(FlowDTO dto);

    FlowDTO update(UUID id, FlowDTO dto);

    void delete(UUID id);

    /**
     * The entity, for assigning a flow to a patient. Scoped to the caller: a flow that
     * belongs to someone else is a 404, exactly as it is on every other route here.
     */
    Flow requireOwned(UUID id);
}
