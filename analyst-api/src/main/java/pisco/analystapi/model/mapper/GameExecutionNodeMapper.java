package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.GameExecutionNodeDTO;
import pisco.analystapi.model.entity.GameExecutionNode;

@Mapper
public interface GameExecutionNodeMapper extends BaseMapper<GameExecutionNode, GameExecutionNodeDTO> {

    /** The owning execution comes from the URL, not from the telemetry payload. */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "execution", ignore = true)
    void updateEntity(@MappingTarget GameExecutionNode node, GameExecutionNodeDTO dto);
}
