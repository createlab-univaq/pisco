package pisco.analystapi.model.mapper;

import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import pisco.analystapi.model.dto.FlowDTO;
import pisco.analystapi.model.entity.Flow;

@Mapper(uses = AnalystMapper.class)
public interface FlowMapper extends BaseMapper<Flow, FlowDTO> {

    /**
     * The default shape, without the graph. Everywhere a flow appears in a list or nested
     * inside another DTO uses this one -- a catalogue of full React Flow graphs would be
     * megabytes to render a dropdown.
     */
    @Override
    @Named("summary")
    @Mapping(target = "flowJson", ignore = true)
    FlowDTO toDto(Flow flow);

    /** Two methods map the same pair, so the list has to say which one it wants. */
    @Override
    @IterableMapping(qualifiedByName = "summary")
    List<FlowDTO> toDto(List<Flow> flows);

    /** Adds the graph. Used only by the by-id endpoint. */
    @Named("detail")
    FlowDTO toDetailDto(Flow flow);

    /**
     * Patches rather than replaces: a null property leaves the entity's value alone, so a
     * PUT carrying only flowJson does not blank the name. Clearing the graph therefore
     * means sending an empty object, which is not null and does get written.
     *
     * <p>The author comes from the token, so it is never read from the payload.
     */
    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "analyst", ignore = true)
    void updateEntity(@MappingTarget Flow flow, FlowDTO dto);
}
