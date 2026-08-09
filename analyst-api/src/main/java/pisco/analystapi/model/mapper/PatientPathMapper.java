package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.PatientPathDTO;
import pisco.analystapi.model.entity.PatientPath;

@Mapper(uses = PatientMapper.class)
public interface PatientPathMapper extends BaseMapper<PatientPath, PatientPathDTO> {

    @Override
    @Mapping(target = "patient", source = "analystPatient.patient")
    PatientPathDTO toDto(PatientPath patientPath);

    /**
     * Only the external path id comes from the client. The code is generated and the
     * assignment timestamp is taken at write time, so neither can be dictated.
     */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "analystPatient", ignore = true)
    @Mapping(target = "uniqueCode", ignore = true)
    @Mapping(target = "assignedAt", ignore = true)
    void updateEntity(@MappingTarget PatientPath patientPath, PatientPathDTO dto);
}
