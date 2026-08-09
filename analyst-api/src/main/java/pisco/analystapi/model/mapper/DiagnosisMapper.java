package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.DiagnosisDTO;
import pisco.analystapi.model.entity.Diagnosis;

@Mapper
public interface DiagnosisMapper extends BaseMapper<Diagnosis, DiagnosisDTO> {

    @Override
    @Mapping(target = "patientId", source = "patient.id")
    DiagnosisDTO toDto(Diagnosis diagnosis);

    /** The patient comes from the path variable, after the ownership check. */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patient", ignore = true)
    void updateEntity(@MappingTarget Diagnosis diagnosis, DiagnosisDTO dto);
}
