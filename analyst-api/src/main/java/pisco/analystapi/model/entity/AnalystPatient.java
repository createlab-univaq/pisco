package pisco.analystapi.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * The assignment of a patient to an analyst (spec section 2.3). A patient can be taken
 * in charge by several analysts and an analyst follows several patients, so this is what
 * everything clinical hangs off: a diagnosis or an assigned path belongs to the pair, not
 * to the patient alone, which is what keeps one analyst's notes out of another's view.
 */
@Entity
@Table(
        name = "analyst_patients",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_analyst_patients_pair",
                columnNames = {"analyst_id", "patient_id"}),
        indexes = {
            @Index(name = "idx_analyst_patients_analyst", columnList = "analyst_id"),
            @Index(name = "idx_analyst_patients_patient", columnList = "patient_id")
        })
@Getter
@Setter
@NoArgsConstructor
public class AnalystPatient extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * No cascade on delete: an analyst still holding assignments cannot be removed until
     * the caller deals with them, which AnalystService enforces before it gets here.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "analyst_id", nullable = false, updatable = false)
    private Analyst analyst;

    /** Deleting the patient takes the assignment, and through it the clinical rows. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Patient patient;

    public AnalystPatient(Analyst analyst, Patient patient) {
        this.analyst = analyst;
        this.patient = patient;
    }
}
