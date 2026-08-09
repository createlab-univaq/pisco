package pisco.analystapi.model.mapper;

import java.util.List;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import pisco.analystapi.model.dto.GameExecutionDTO;
import pisco.analystapi.model.entity.GameExecution;

@Mapper(uses = {GameAnswerMapper.class, PatientPathMapper.class})
public interface GameExecutionMapper extends BaseMapper<GameExecution, GameExecutionDTO> {

    /** The default shape: no answers, so listing runs does not drag every telemetry row along. */
    @Override
    @Named("summary")
    @Mapping(target = "answers", ignore = true)
    GameExecutionDTO toDto(GameExecution execution);

    /** Two methods map the same pair, so the list has to say which one it wants. */
    @Override
    @IterableMapping(qualifiedByName = "summary")
    List<GameExecutionDTO> toDto(List<GameExecution> executions);

    /** Adds the answers, ordered by sequence number. Used by the detail endpoint. */
    GameExecutionDTO toDetailDto(GameExecution execution);

    /**
     * Only the two timestamps are taken from the payload as-is. The path is resolved from
     * the unique code and the answers are rebuilt one by one, since each needs its node
     * type looked up before it can be attached.
     */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patientPath", ignore = true)
    @Mapping(target = "answers", ignore = true)
    void updateEntity(@MappingTarget GameExecution execution, GameExecutionDTO dto);
}
