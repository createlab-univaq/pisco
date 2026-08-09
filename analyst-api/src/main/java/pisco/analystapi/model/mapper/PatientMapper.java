package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.PatientDTO;
import pisco.analystapi.model.entity.Patient;

@Mapper(uses = DegreeMapper.class)
public interface PatientMapper extends BaseMapper<Patient, PatientDTO> {

    /** The degree is resolved by the service: it has to be validated against the lookup. */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "degree", ignore = true)
    void updateEntity(@MappingTarget Patient patient, PatientDTO dto);
}
