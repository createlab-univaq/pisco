package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.PatientDTO;
import pisco.analystapi.model.entity.Patient;

@Mapper
public interface PatientMapper extends BaseMapper<Patient, PatientDTO> {

    @Override
    @Mapping(target = "educationLevelCode", source = "educationLevel.code")
    @Mapping(target = "educationLevelLabel", source = "educationLevel.label")
    PatientDTO toDto(Patient patient);

    /**
     * Ownership and the education level are resolved by the service: one comes from the
     * token, the other has to be validated against the lookup table first.
     */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "analyst", ignore = true)
    @Mapping(target = "educationLevel", ignore = true)
    void updateEntity(@MappingTarget Patient patient, PatientDTO dto);
}
