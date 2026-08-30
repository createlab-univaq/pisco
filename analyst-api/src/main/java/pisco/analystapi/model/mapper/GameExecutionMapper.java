package pisco.analystapi.model.mapper;

import java.util.List;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import pisco.analystapi.model.dto.GameExecutionDTO;
import pisco.analystapi.model.entity.GameExecution;

@Mapper(uses = {GameExecutionNodeMapper.class, PatientPathMapper.class})
public interface GameExecutionMapper extends BaseMapper<GameExecution, GameExecutionDTO> {

    /** The default shape: no nodes, so listing runs does not drag every answer along. */
    @Override
    @Named("summary")
    @Mapping(target = "nodes", ignore = true)
    @Mapping(target = "flowCode", ignore = true)
    GameExecutionDTO toDto(GameExecution execution);

    /** Two methods map the same pair, so the list has to say which one it wants. */
    @Override
    @IterableMapping(qualifiedByName = "summary")
    List<GameExecutionDTO> toDto(List<GameExecution> executions);

    /** Adds the nodes and their answers, in the order they were played. */
    @Mapping(target = "flowCode", ignore = true)
    GameExecutionDTO toDetailDto(GameExecution execution);

    /**
     * Only the run name and the two timestamps are taken from the payload as-is. The path
     * is resolved from the flow code and the nodes are rebuilt one by one.
     */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patientPath", ignore = true)
    @Mapping(target = "nodes", ignore = true)
    void updateEntity(@MappingTarget GameExecution execution, GameExecutionDTO dto);
}
