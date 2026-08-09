package pisco.analystapi.config.seeder;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.model.entity.Degree;
import pisco.analystapi.model.repository.DegreeRepository;

/**
 * Populates the fixed lookup table on startup. Only missing codes are inserted, so a
 * label corrected by hand in the database is not overwritten on the next boot.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DegreeSeeder implements ApplicationRunner {

    private static final List<Degree> DEGREES = List.of(
            new Degree("LICENZA_MEDIA", "Licenza media", 1),
            new Degree("DIPLOMA", "Diploma", 2),
            new Degree("LAUREA_TRIENNALE", "Laurea triennale", 3),
            new Degree("LAUREA_MAGISTRALE", "Laurea magistrale", 4),
            new Degree("DOTTORATO", "Dottorato", 5),
            new Degree("ALTRO", "Altro", 6));

    private final DegreeRepository repository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<Degree> missing = DEGREES.stream()
                .filter(degree -> !repository.existsById(degree.getCode()))
                .toList();

        if (!missing.isEmpty()) {
            repository.saveAll(missing);
            log.info("Inseriti {} titoli di studio mancanti", missing.size());
        }
    }
}
