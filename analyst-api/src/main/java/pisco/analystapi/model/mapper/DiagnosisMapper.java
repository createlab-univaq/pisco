package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.DiagnosisDTO;
import pisco.analystapi.model.entity.Diagnosis;

@Mapper(uses = PatientMapper.class)
public interface DiagnosisMapper extends BaseMapper<Diagnosis, DiagnosisDTO> {

    /** The DTO still speaks in patients: the assignment is an internal detail. */
    @Override
    @Mapping(target = "patient", source = "analystPatient.patient")
    DiagnosisDTO toDto(Diagnosis diagnosis);

    /** The assignment is resolved from the path variable, after the ownership check. */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "analystPatient", ignore = true)
    void updateEntity(@MappingTarget Diagnosis diagnosis, DiagnosisDTO dto);
}
