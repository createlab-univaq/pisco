package pisco.analystapi.controller;

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
public class PolyglotPathController {

    private final PolyglotClient polyglotClient;

    /**
     * Proxy for the flow catalogue the analyst picks from. The browser cannot call
     * Polyglot directly: that route is guarded by a shared secret which has no business
     * being in a front-end bundle.
     */
    @GetMapping
    public Object list() {
        log.info("GET /api/polyglot-paths");
        return polyglotClient.fetchCatalog();
    }
}
