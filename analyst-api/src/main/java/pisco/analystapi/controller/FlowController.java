package pisco.analystapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.model.dto.FlowDTO;
import pisco.analystapi.model.dto.validation.ValidationGroups.Create;
import pisco.analystapi.model.dto.validation.ValidationGroups.Update;
import pisco.analystapi.service.FlowService;

@RestController
@RequestMapping("/api/flows")
@RequiredArgsConstructor
@Slf4j
@Tag(
        name = "Flow",
        description = "Percorsi autorati qui, non piu' su Polyglot. Ogni analista possiede i "
                + "propri: tutti li vedono e possono assegnarli, solo l'autore li modifica.")
public class FlowController {

    private final FlowService service;

    @Operation(
            summary = "Elenca i flow",
            description = "Senza flowJson: la struttura arriva solo dal dettaglio. "
                    + "Ordinati per nome.")
    @GetMapping
    public List<FlowDTO> list() {
        log.info("GET /api/flows");
        return service.findAll();
    }

    @Operation(
            summary = "Recupera un flow con la sua struttura",
            description = "L'unico endpoint che restituisce flowJson, il grafo React Flow.")
    @GetMapping("/{id}")
    public FlowDTO get(@PathVariable UUID id) {
        log.info("GET /api/flows/{}", id);
        return service.findById(id);
    }

    @Operation(
            summary = "Crea un flow",
            description = "L'autore e' l'analista chiamante. 409 se ha gia' un flow con lo "
                    + "stesso nome; nomi diversi fra analisti diversi non danno conflitto.")
    @PostMapping
    public ResponseEntity<FlowDTO> create(@Validated(Create.class) @RequestBody FlowDTO dto) {
        log.info("POST /api/flows name={}", dto.getName());
        FlowDTO created = service.create(dto);
        return ResponseEntity.created(URI.create("/api/flows/" + created.getId())).body(created);
    }

    @Operation(
            summary = "Modifica un flow",
            description = "Riservato all'autore. Vengono aggiornati solo i campi presenti nel "
                    + "corpo, gli altri restano invariati. Per svuotare la struttura passare "
                    + "flowJson come oggetto vuoto, non ometterlo.")
    @PatchMapping("/{id}")
    public FlowDTO patch(@PathVariable UUID id, @Validated(Update.class) @RequestBody FlowDTO dto) {
        log.info("PATCH /api/flows/{}", id);
        return service.update(id, dto);
    }

    @Operation(
            summary = "Elimina un flow",
            description = "Riservato all'autore. 409 se il flow e' assegnato a un paziente: "
                    + "va prima rimossa l'assegnazione.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("DELETE /api/flows/{}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
