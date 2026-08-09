package pisco.analystapi.service;

import java.util.List;
import pisco.analystapi.model.dto.DegreeDTO;

public interface DegreeService {

    List<DegreeDTO> findAll();
}
