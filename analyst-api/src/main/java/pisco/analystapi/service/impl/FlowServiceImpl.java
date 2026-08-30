package pisco.analystapi.service.impl;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import pisco.analystapi.config.security.SecurityUtils;
import pisco.analystapi.exception.ConflictException;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.dto.FlowDTO;
import pisco.analystapi.model.entity.Flow;
import pisco.analystapi.model.mapper.FlowMapper;
import pisco.analystapi.model.repository.AnalystRepository;
import pisco.analystapi.model.repository.FlowRepository;
import pisco.analystapi.service.FlowService;

/**
 * Reading is open to every analyst so a colleague's flow can be assigned; writing is not,
 * since a flow belongs to whoever authored it.
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
    public List<FlowDTO> findAll() {
        List<Flow> flows = repository.findAllByOrderByNameAsc();
        log.debug("Elenco flow: {} risultati", flows.size());
        return mapper.toDto(flows);
    }

    @Override
    @Transactional(readOnly = true)
    public FlowDTO findById(UUID id) {
        return mapper.toDetailDto(requireById(id));
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
        repository.delete(requireOwned(id));
        log.info("Flow eliminato id={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Flow requireById(UUID id) {
        return repository.findById(id).orElseThrow(() -> {
            log.info("Flow {} non trovato", id);
            return NotFoundException.of("Flow", id);
        });
    }

    private Flow requireOwned(UUID id) {
        Flow flow = requireById(id);
        UUID analystId = SecurityUtils.currentAnalystId();
        if (!flow.getAnalyst().getId().equals(analystId)) {
            log.warn("Flow {} non modificabile da analystId={}: appartiene a {}",
                    id, analystId, flow.getAnalyst().getId());
            throw new NotFoundException("Flow non modificabile: " + id);
        }
        return flow;
    }
}
