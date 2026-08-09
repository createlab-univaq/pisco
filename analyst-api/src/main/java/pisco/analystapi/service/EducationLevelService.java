package pisco.analystapi.service;

import java.util.List;
import pisco.analystapi.model.dto.EducationLevelDTO;

public interface EducationLevelService {

    List<EducationLevelDTO> findAll();
}
