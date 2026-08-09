package pisco.analystapi.config.seeder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import pisco.analystapi.model.entity.Analyst;
import pisco.analystapi.model.entity.Role;
import pisco.analystapi.model.repository.AnalystRepository;

@RequiredArgsConstructor
@Component
@Slf4j
@Profile("local")
public class AdminSeeder implements ApplicationRunner {

    private final AnalystRepository analystRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        if (!analystRepository.findAllByRole(Role.ADMIN).isEmpty()) {
            return;
        }
        log.debug("No admin found, creating default admin");
        Analyst analyst = new Analyst();
        analyst.setEmail("admin@createlab-univaq.it");
        analyst.setFirstName("admin");
        analyst.setLastName("pisco");
        analyst.setRole(Role.ADMIN);
        analyst.setPasswordHash(passwordEncoder.encode("piscoadmin123"));
        analystRepository.save(analyst);
    }

}
