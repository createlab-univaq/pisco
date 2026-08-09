package pisco.analystapi.service.impl;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.model.dto.EducationLevelDTO;
import pisco.analystapi.model.entity.EducationLevel;
import pisco.analystapi.model.mapper.EducationLevelMapper;
import pisco.analystapi.model.repository.EducationLevelRepository;
import pisco.analystapi.service.EducationLevelService;

@Service
@RequiredArgsConstructor
@Slf4j
public class EducationLevelServiceImpl implements EducationLevelService {

    private final EducationLevelRepository repository;
    private final EducationLevelMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<EducationLevelDTO> findAll() {
        List<EducationLevel> levels = repository.findAllByOrderBySortOrderAsc();
        // Debug, not info: this fires on every render of the patient form and says
        // nothing useful once the table is known to be seeded.
        log.debug("Titoli di studio richiesti: {} risultati", levels.size());
        return mapper.toDto(levels);
    }
}
