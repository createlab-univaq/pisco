package pisco.analystapi.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.model.dto.AnalystDTO;
import pisco.analystapi.model.dto.validation.ValidationGroups.Create;
import pisco.analystapi.model.dto.validation.ValidationGroups.Update;
import pisco.analystapi.service.AnalystService;

@RestController
@RequestMapping("/api/analysts")
@RequiredArgsConstructor
@Slf4j
public class AnalystController {

    private final AnalystService service;

    /** Public: without it there is no way to create the first analyst. */
    @PostMapping
    public ResponseEntity<AnalystDTO> create(@Validated(Create.class) @RequestBody AnalystDTO dto) {
        log.info("POST /api/analysts email={}", dto.getEmail());
        AnalystDTO created = service.create(dto);
        return ResponseEntity.created(URI.create("/api/analysts/" + created.getId())).body(created);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AnalystDTO> list() {
        log.info("GET /api/analysts");
        return service.findAll();
    }

    /** Self or admin -- enforced in the service, which knows who is calling. */
    @GetMapping("/{id}")
    public AnalystDTO get(@PathVariable UUID id) {
        log.info("GET /api/analysts/{}", id);
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public AnalystDTO update(@PathVariable UUID id, @Validated(Update.class) @RequestBody AnalystDTO dto) {
        log.info("PUT /api/analysts/{} email={}", id, dto.getEmail());
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("DELETE /api/analysts/{}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
