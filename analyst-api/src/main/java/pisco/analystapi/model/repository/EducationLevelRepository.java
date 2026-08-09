package pisco.analystapi.model.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.EducationLevel;

public interface EducationLevelRepository extends JpaRepository<EducationLevel, String> {

    List<EducationLevel> findAllByOrderBySortOrderAsc();
}
