package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.GameExecutionNodeDTO;
import pisco.analystapi.model.entity.GameExecutionNode;

@Mapper(uses = GameAnswerMapper.class)
public interface GameExecutionNodeMapper
        extends BaseMapper<GameExecutionNode, GameExecutionNodeDTO> {

    @Override
    @Mapping(target = "isExercise", source = "exercise")
    GameExecutionNodeDTO toDto(GameExecutionNode node);

    /** The answers are rebuilt one by one by the service, so each gets its position. */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "execution", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "answers", ignore = true)
    @Mapping(target = "exercise", source = "isExercise")
    void updateEntity(@MappingTarget GameExecutionNode node, GameExecutionNodeDTO dto);
}
