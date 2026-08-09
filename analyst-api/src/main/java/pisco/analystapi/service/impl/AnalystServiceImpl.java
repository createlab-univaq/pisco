package pisco.analystapi.service.impl;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import pisco.analystapi.config.security.SecurityUtils;
import pisco.analystapi.exception.ConflictException;
import pisco.analystapi.exception.NotFoundException;
import pisco.analystapi.model.dto.AnalystDTO;
import pisco.analystapi.model.entity.Analyst;
import pisco.analystapi.model.entity.Role;
import pisco.analystapi.model.mapper.AnalystMapper;
import pisco.analystapi.model.repository.AnalystRepository;
import pisco.analystapi.model.repository.PatientRepository;
import pisco.analystapi.service.AnalystService;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalystServiceImpl implements AnalystService {

    private final AnalystRepository repository;
    private final PatientRepository patientRepository;
    private final AnalystMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public AnalystDTO create(AnalystDTO dto) {
        String email = normalizeEmail(dto.getEmail());
        if (repository.existsByEmail(email)) {
            log.warn("Registrazione rifiutata: email gia' presente {}", email);
            throw new ConflictException("Email gia' registrata: " + email);
        }

        Analyst analyst = new Analyst();
        mapper.updateEntity(analyst, dto);
        analyst.setEmail(email);
        analyst.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        analyst.setRole(Role.ANALYST);

        // Flush before mapping so createdAt is populated in the response -- see
        // PatientServiceImpl.create for the reasoning.
        Analyst saved = repository.saveAndFlush(analyst);
        log.info("Analista creato id={} email={} ruolo={}", saved.getId(), email, saved.getRole());
        return mapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnalystDTO> findAll() {
        List<Analyst> analysts = repository.findAllByOrderByLastNameAscFirstNameAsc();
        log.debug("Elenco analisti: {} risultati", analysts.size());
        return mapper.toDto(analysts);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalystDTO findById(UUID id) {
        assertSelfOrAdmin(id);
        return mapper.toDto(require(id));
    }

    @Override
    @Transactional
    public AnalystDTO update(UUID id, AnalystDTO dto) {
        assertSelfOrAdmin(id);
        Analyst analyst = require(id);

        String email = normalizeEmail(dto.getEmail());
        if (repository.existsByEmailAndIdNot(email, id)) {
            log.warn("Modifica analista {} rifiutata: email {} gia' in uso", id, email);
            throw new ConflictException("Email gia' registrata: " + email);
        }

        mapper.updateEntity(analyst, dto);
        analyst.setEmail(email);
        // Absent password means "leave it alone", not "clear it".
        boolean passwordChanged = StringUtils.hasText(dto.getPassword());
        if (passwordChanged) {
            analyst.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }

        log.info("Analista aggiornato id={} passwordCambiata={}", id, passwordChanged);
        return mapper.toDto(analyst);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        assertSelfOrAdmin(id);
        Analyst analyst = require(id);

        // Patients are not orphaned or silently destroyed: the caller has to deal with
        // them first. This is why that foreign key is restrict rather than cascade.
        if (patientRepository.existsByAnalystId(id)) {
            log.warn("Eliminazione analista {} rifiutata: ha ancora pazienti associati", id);
            throw new ConflictException(
                    "L'analista ha ancora pazienti associati: eliminarli o riassegnarli prima");
        }

        repository.delete(analyst);
        log.info("Analista eliminato id={}", id);
    }

    private Analyst require(UUID id) {
        return repository.findById(id).orElseThrow(() -> {
            log.info("Analista {} non trovato", id);
            return NotFoundException.of("Analista", id);
        });
    }

    /** Admins reach every analyst record; everyone else only their own. */
    private void assertSelfOrAdmin(UUID id) {
        if (!SecurityUtils.isAdmin() && !SecurityUtils.currentAnalystId().equals(id)) {
            log.warn("Accesso negato: analista {} ha tentato di operare su {}",
                    SecurityUtils.currentAnalystId(), id);
            throw new AccessDeniedException("Permessi insufficienti su questo analista");
        }
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
