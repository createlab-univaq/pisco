package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.AnalystDTO;
import pisco.analystapi.model.entity.Analyst;

@Mapper
public interface AnalystMapper extends BaseMapper<Analyst, AnalystDTO> {

    /**
     * password has no counterpart on the entity (which holds passwordHash), so it stays
     * null on the way out -- the hash cannot leak through the mapper even by accident.
     */
    @Override
    AnalystDTO toDto(Analyst analyst);

    /** Identity, role and credentials are the service's business, never the payload's. */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "email", ignore = true)
    void updateEntity(@MappingTarget Analyst analyst, AnalystDTO dto);
}
