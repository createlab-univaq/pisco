package pisco.analystapi.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.model.dto.EducationLevelDTO;
import pisco.analystapi.service.EducationLevelService;

@RestController
@RequestMapping("/api/education-levels")
@RequiredArgsConstructor
@Slf4j
public class EducationLevelController {

    private final EducationLevelService service;

    /** Feeds the patient form's dropdown (spec section 2.4). */
    @GetMapping
    public List<EducationLevelDTO> list() {
        log.info("GET /api/education-levels");
        return service.findAll();
    }
}
