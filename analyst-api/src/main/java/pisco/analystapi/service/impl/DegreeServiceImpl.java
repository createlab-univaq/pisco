package pisco.analystapi.service.impl;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.model.dto.DegreeDTO;
import pisco.analystapi.model.entity.Degree;
import pisco.analystapi.model.mapper.DegreeMapper;
import pisco.analystapi.model.repository.DegreeRepository;
import pisco.analystapi.service.DegreeService;

@Service
@RequiredArgsConstructor
@Slf4j
public class DegreeServiceImpl implements DegreeService {

    private final DegreeRepository repository;
    private final DegreeMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<DegreeDTO> findAll() {
        List<Degree> degrees = repository.findAllByOrderByEducationLevelAsc();
        // Debug, not info: this fires on every render of the patient form and says
        // nothing useful once the table is known to be seeded.
        log.debug("Titoli di studio richiesti: {} risultati", degrees.size());
        return mapper.toDto(degrees);
    }
}
