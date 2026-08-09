package pisco.analystapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.client.PolyglotClient;

@RestController
@RequestMapping("/api/polyglot-paths")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Catalogo Polyglot", description = "Proxy verso il sistema esterno Polyglot.")
public class PolyglotPathController {

    private final PolyglotClient polyglotClient;

    /**
     * Proxy for the flow catalogue the analyst picks from. The browser cannot call
     * Polyglot directly: that route is guarded by a shared secret which has no business
     * being in a front-end bundle.
     */
    @Operation(
            summary = "Elenca i percorsi disponibili su Polyglot",
            description = "Proxy verso il catalogo da cui l'analista sceglie. Il browser non "
                    + "puo' interrogare Polyglot direttamente: quella rotta e' protetta da un "
                    + "segreto condiviso, che non ha motivo di stare in un bundle front-end. "
                    + "La risposta e' quella di Polyglot, inoltrata cosi' com'e'.")
    @GetMapping
    public Object list() {
        log.info("GET /api/polyglot-paths");
        return polyglotClient.fetchCatalog();
    }
}
