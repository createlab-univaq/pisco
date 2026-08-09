package pisco.analystapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.model.dto.DegreeDTO;
import pisco.analystapi.service.DegreeService;

@RestController
@RequestMapping("/api/degrees")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Titoli di studio", description = "Anagrafica di appoggio, in sola lettura.")
public class DegreeController {

    private final DegreeService service;

    /** Feeds the patient form's dropdown (spec section 2.5). */
    @Operation(
            summary = "Elenca i titoli di studio",
            description = "Gia' ordinati per livello di istruzione crescente, per la tendina "
                    + "della scheda paziente. I codici sono quelli attesi in PatientDTO.degree.")
    @GetMapping
    public List<DegreeDTO> list() {
        log.info("GET /api/degrees");
        return service.findAll();
    }
}
