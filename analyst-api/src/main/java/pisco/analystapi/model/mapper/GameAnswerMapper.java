package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.GameAnswerDTO;
import pisco.analystapi.model.entity.GameAnswer;

@Mapper(uses = NodeTypeMapper.class)
public interface GameAnswerMapper extends BaseMapper<GameAnswer, GameAnswerDTO> {

    /**
     * The owning execution comes from the URL, and the node type is resolved against the
     * lookup by the service -- neither is taken from the telemetry payload as-is.
     */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "execution", ignore = true)
    @Mapping(target = "nodeType", ignore = true)
    void updateEntity(@MappingTarget GameAnswer answer, GameAnswerDTO dto);
}
