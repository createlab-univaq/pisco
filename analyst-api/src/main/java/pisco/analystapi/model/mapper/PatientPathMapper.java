package pisco.analystapi.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pisco.analystapi.model.dto.PatientPathDTO;
import pisco.analystapi.model.entity.PatientPath;

@Mapper(uses = {PatientMapper.class, FlowMapper.class})
public interface PatientPathMapper extends BaseMapper<PatientPath, PatientPathDTO> {

    /**
     * The flow is mapped through the summary method: an assignment names which flow it is,
     * and has no business carrying the whole React Flow graph with it.
     */
    @Override
    @Mapping(target = "patient", source = "analystPatient.patient")
    @Mapping(target = "flow", source = "flow", qualifiedByName = "summary")
    PatientPathDTO toDto(PatientPath patientPath);

    /**
     * Only the flow reference comes from the client, and the service resolves it. The code
     * is generated and the assignment timestamp taken at write time, so neither can be
     * dictated.
     */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "analystPatient", ignore = true)
    @Mapping(target = "flow", ignore = true)
    @Mapping(target = "uniqueCode", ignore = true)
    @Mapping(target = "assignedAt", ignore = true)
    void updateEntity(@MappingTarget PatientPath patientPath, PatientPathDTO dto);
}
