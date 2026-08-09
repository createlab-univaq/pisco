package pisco.analystapi.config.seeder;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.model.entity.EducationLevel;
import pisco.analystapi.model.repository.EducationLevelRepository;

/**
 * Populates the fixed lookup table on startup. Only missing codes are inserted, so a
 * label corrected by hand in the database is not overwritten on the next boot.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EducationLevelSeeder implements ApplicationRunner {

    private static final List<EducationLevel> LEVELS = List.of(
            new EducationLevel("LICENZA_MEDIA", "Licenza media", 10),
            new EducationLevel("DIPLOMA", "Diploma", 20),
            new EducationLevel("LAUREA_TRIENNALE", "Laurea triennale", 30),
            new EducationLevel("LAUREA_MAGISTRALE", "Laurea magistrale", 40),
            new EducationLevel("DOTTORATO", "Dottorato", 50),
            new EducationLevel("ALTRO", "Altro", 60));

    private final EducationLevelRepository repository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<EducationLevel> missing = LEVELS.stream()
                .filter(level -> !repository.existsById(level.getCode()))
                .toList();

        if (!missing.isEmpty()) {
            repository.saveAll(missing);
            log.info("Inseriti {} titoli di studio mancanti", missing.size());
        }
    }
}
