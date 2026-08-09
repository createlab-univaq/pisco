package pisco.analystapi.model.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.Analyst;
import pisco.analystapi.model.entity.Role;

public interface AnalystRepository extends JpaRepository<Analyst, UUID> {

    Optional<Analyst> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, UUID id);

    List<Analyst> findAllByOrderByLastNameAscFirstNameAsc();

    List<Analyst> findAllByRole(Role role);

}
