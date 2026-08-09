package pisco.analystapi.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pisco.analystapi.common.LogUtils;
import pisco.analystapi.model.dto.ResolvedPathDTO;
import pisco.analystapi.service.PatientPathService;

/**
 * Redeeming a unique code. Assigning and removing paths happen under the patient, on
 * {@link PatientController}; this is the one route the patient's own client calls.
 */
@RestController
@RequestMapping("/api/paths")
@RequiredArgsConstructor
@Slf4j
public class PathController {

    private final PatientPathService service;

    /**
     * Unauthenticated by design (spec section 1): the patient has no login and redeems
     * the code they were given. The code is masked in the log -- here it is a credential.
     */
    @GetMapping("/resolve/{uniqueCode}")
    public ResolvedPathDTO resolve(@PathVariable String uniqueCode) {
        log.info("GET /api/paths/resolve/{}", LogUtils.maskCode(uniqueCode));
        return service.resolve(uniqueCode);
    }
}
