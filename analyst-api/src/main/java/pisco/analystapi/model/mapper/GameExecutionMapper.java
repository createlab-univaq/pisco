package pisco.analystapi.model.mapper;

import java.util.List;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import pisco.analystapi.model.dto.GameExecutionDTO;
import pisco.analystapi.model.entity.GameExecution;

@Mapper(uses = GameExecutionNodeMapper.class)
public interface GameExecutionMapper extends BaseMapper<GameExecution, GameExecutionDTO> {

    /** The default shape: no nodes, so listing runs does not drag every telemetry row along. */
    @Override
    @Named("summary")
    @Mapping(target = "patientPathId", source = "patientPath.id")
    @Mapping(target = "patientId", source = "patientPath.patient.id")
    @Mapping(target = "uniqueCode", source = "patientPath.uniqueCode")
    @Mapping(target = "polyglotPathId", source = "patientPath.polyglotPathId")
    @Mapping(target = "nodes", ignore = true)
    GameExecutionDTO toDto(GameExecution execution);

    /** Two methods map the same pair, so the list has to say which one it wants. */
    @Override
    @IterableMapping(qualifiedByName = "summary")
    List<GameExecutionDTO> toDto(List<GameExecution> executions);

    /** Adds the traversed nodes, ordered by sequence number. Used by the detail endpoint. */
    @Mapping(target = "patientPathId", source = "patientPath.id")
    @Mapping(target = "patientId", source = "patientPath.patient.id")
    @Mapping(target = "uniqueCode", source = "patientPath.uniqueCode")
    @Mapping(target = "polyglotPathId", source = "patientPath.polyglotPathId")
    GameExecutionDTO toDetailDto(GameExecution execution);

    /**
     * Inherited for uniformity but unused: an execution is opened from a redeemed code
     * and closed by the server, so no field of it is ever dictated by a payload.
     */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patientPath", ignore = true)
    @Mapping(target = "startedAt", ignore = true)
    @Mapping(target = "finishedAt", ignore = true)
    @Mapping(target = "nodes", ignore = true)
    void updateEntity(@MappingTarget GameExecution execution, GameExecutionDTO dto);
}
