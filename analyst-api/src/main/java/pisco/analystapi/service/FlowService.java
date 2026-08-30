package pisco.analystapi.service;

import java.util.List;
import java.util.UUID;
import pisco.analystapi.model.dto.FlowDTO;
import pisco.analystapi.model.entity.Flow;

public interface FlowService {

    /** Every flow, without its graph. */
    List<FlowDTO> findAll();

    /** The one place a flow comes back with its React Flow graph attached. */
    FlowDTO findById(UUID id);

    FlowDTO create(FlowDTO dto);

    FlowDTO update(UUID id, FlowDTO dto);

    void delete(UUID id);

    /** The entity, for assigning a flow to a patient. Any analyst may assign any flow. */
    Flow requireById(UUID id);
}
