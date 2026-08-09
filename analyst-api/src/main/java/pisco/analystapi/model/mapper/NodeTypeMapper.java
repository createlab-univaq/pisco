package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import pisco.analystapi.model.dto.NodeTypeDTO;
import pisco.analystapi.model.entity.NodeType;

/**
 * Rows appear as telemetry names new types, never through a write endpoint, so nothing
 * calls updateEntity here -- it is inherited for uniformity.
 */
@Mapper
public interface NodeTypeMapper extends BaseMapper<NodeType, NodeTypeDTO> {}
