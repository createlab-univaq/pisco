package pisco.analystapi.model.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import pisco.analystapi.model.entity.Patient;

/**
 * Plain anagraphic access, unscoped: any analyst may browse the register. Which patients
 * a caller is actually treating is a property of the assignment, so that read belongs to
 * {@link AnalystPatientRepository}.
 */
public interface PatientRepository extends JpaRepository<Patient, UUID> {

    List<Patient> findAllByOrderByLastNameAscFirstNameAsc();
}
