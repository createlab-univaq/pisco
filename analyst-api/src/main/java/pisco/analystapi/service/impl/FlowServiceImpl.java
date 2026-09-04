package pisco.analystapi.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import pisco.analystapi.config.security.SecurityUtils;
import pisco.analystapi.exception.ConflictException;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.criteria.FlowCriteria;
import pisco.analystapi.model.dto.FlowDTO;
import pisco.analystapi.model.entity.Flow;
import pisco.analystapi.model.mapper.FlowMapper;
import pisco.analystapi.model.repository.AnalystRepository;
import pisco.analystapi.model.repository.FlowRepository;
import pisco.analystapi.model.repository.specifications.FlowSpecifications;
import pisco.analystapi.service.FlowService;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * A flow belongs to whoever authored it: nobody else can read, edit or assign it.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FlowServiceImpl implements FlowService {

    private final FlowRepository repository;
    private final AnalystRepository analystRepository;
    private final FlowMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<FlowDTO> findAll(FlowCriteria criteria) {
        Specification<Flow> specification = FlowCriteria.getSpecification(criteria);
        specification = specification.and(FlowSpecifications.ownedBy(SecurityUtils.currentAnalystId()));
        List<Flow> flows = repository.findAll(specification, criteria.toSort());
        log.debug("Elenco flow: {}, {}", criteria, flows.size());
        return mapper.toDto(flows);
    }

    @Override
    @Transactional(readOnly = true)
    public FlowDTO findById(UUID id) {
        return mapper.toDetailDto(requireOwned(id));
    }

    @Override
    @Transactional
    public FlowDTO create(FlowDTO dto) {
        UUID analystId = SecurityUtils.currentAnalystId();
        if (repository.existsByAnalystIdAndName(analystId, dto.getName())) {
            log.warn("Creazione flow rifiutata: nome {} gia' usato dall'analista {}",
                    dto.getName(), analystId);
            throw new ConflictException("Esiste gia' un flow con questo nome: " + dto.getName());
        }

        Flow flow = new Flow();
        mapper.updateEntity(flow, dto);
        // getReferenceById avoids loading the analyst just to set a foreign key.
        flow.setAnalyst(analystRepository.getReferenceById(analystId));

        Flow saved = repository.saveAndFlush(flow);
        log.info("Flow creato id={} analystId={}", saved.getId(), analystId);
        return mapper.toDetailDto(saved);
    }

    @Override
    @Transactional
    public FlowDTO update(UUID id, FlowDTO dto) {
        Flow flow = requireOwned(id);
        // Only when the payload actually carries a name: this is a patch, and an omitted
        // name means "leave it alone" rather than "rename to null".
        if (StringUtils.hasText(dto.getName())
                && repository.existsByAnalystIdAndNameAndIdNot(
                flow.getAnalyst().getId(), dto.getName(), id)) {
            log.warn("Modifica flow {} rifiutata: nome {} gia' usato", id, dto.getName());
            throw new ConflictException("Esiste gia' un flow con questo nome: " + dto.getName());
        }

        mapper.updateEntity(flow, dto);
        log.info("Flow aggiornato id={}", id);
        return mapper.toDetailDto(flow);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        // Assignments referencing it block the delete: the foreign key on patient_paths is
        // restrict, so a flow handed to a patient cannot vanish under their feet.
        requireOwned(id);
        repository.deleteById(id);
        log.info("Flow eliminato id={}", id);
    }

    /**
     * Ownership is part of the query rather than a check after the fact: a flow belonging
     * to another analyst comes back empty and turns into a 404, which tells the caller
     * nothing about whether it exists.
     */
    @Override
    @Transactional(readOnly = true)
    public Flow requireOwned(UUID id) {
        UUID analystId = SecurityUtils.currentAnalystId();
        return repository.findByIdAndAnalystId(id, analystId).orElseThrow(() -> {
            log.info("Flow {} non accessibile per analystId={}", id, analystId);
            return NotFoundException.of("Flow", id);
        });
    }
}
