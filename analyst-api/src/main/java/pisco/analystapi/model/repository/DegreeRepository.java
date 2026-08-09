package pisco.analystapi.model.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.Degree;

public interface DegreeRepository extends JpaRepository<Degree, String> {

    List<Degree> findAllByOrderByEducationLevelAsc();
}
