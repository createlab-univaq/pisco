package pisco.analystapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.model.dto.NodeTypeDTO;
import pisco.analystapi.service.NodeTypeService;

@RestController
@RequestMapping("/api/node-types")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Tipi di nodo", description = "Anagrafica di appoggio, in sola lettura.")
public class NodeTypeController {

    private final NodeTypeService service;

    /** The node kinds seen so far, for filtering telemetry (spec section 5). */
    @Operation(
            summary = "Elenca i tipi di nodo del gioco",
            description = "La tabella non e' precaricata: si popola da sola quando la "
                    + "telemetria riporta un tipo mai visto, quindi elenca i tipi realmente "
                    + "giocati finora.")
    @GetMapping
    public List<NodeTypeDTO> list() {
        log.info("GET /api/node-types");
        return service.findAll();
    }
}
