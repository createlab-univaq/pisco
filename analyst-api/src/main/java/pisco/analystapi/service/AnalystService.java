package pisco.analystapi.service;

import java.util.List;
import java.util.UUID;
import pisco.analystapi.model.dto.AnalystDTO;

public interface AnalystService {

    AnalystDTO create(AnalystDTO dto);

    List<AnalystDTO> findAll();

    AnalystDTO findById(UUID id);

    AnalystDTO update(UUID id, AnalystDTO dto);

    void delete(UUID id);
}
