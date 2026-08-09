package pisco.analystapi.service.impl;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.model.dto.NodeTypeDTO;
import pisco.analystapi.model.entity.NodeType;
import pisco.analystapi.model.mapper.NodeTypeMapper;
import pisco.analystapi.model.repository.NodeTypeRepository;
import pisco.analystapi.service.NodeTypeService;

@Service
@RequiredArgsConstructor
@Slf4j
public class NodeTypeServiceImpl implements NodeTypeService {

    private final NodeTypeRepository repository;
    private final NodeTypeMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<NodeTypeDTO> findAll() {
        List<NodeType> nodeTypes = repository.findAllByOrderByLabelAsc();
        log.debug("Tipi di nodo richiesti: {} risultati", nodeTypes.size());
        return mapper.toDto(nodeTypes);
    }

    @Override
    @Transactional
    public NodeType resolveOrRegister(String label) {
        return repository.findByLabel(label).orElseGet(() -> register(label));
    }

    private NodeType register(String label) {
        try {
            NodeType saved = repository.saveAndFlush(new NodeType(label));
            log.info("Nuovo tipo di nodo registrato id={} label={}", saved.getId(), label);
            return saved;
        } catch (DataIntegrityViolationException e) {
            // Two sessions can report an unseen type at the same time. The unique index on
            // label is what settles it; the loser re-reads the row the winner inserted.
            log.debug("Tipo di nodo {} inserito da una richiesta concorrente", label);
            return repository.findByLabel(label).orElseThrow(() -> e);
        }
    }
}
