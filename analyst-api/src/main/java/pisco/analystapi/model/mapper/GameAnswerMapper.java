package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.GameAnswerDTO;
import pisco.analystapi.model.entity.GameAnswer;

@Mapper
public interface GameAnswerMapper extends BaseMapper<GameAnswer, GameAnswerDTO> {

    /** The owning node and the position come from the payload's order, not its contents. */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "executionNode", ignore = true)
    @Mapping(target = "position", ignore = true)
    void updateEntity(@MappingTarget GameAnswer answer, GameAnswerDTO dto);
}
