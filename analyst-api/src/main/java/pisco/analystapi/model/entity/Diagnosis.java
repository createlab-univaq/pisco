package pisco.analystapi.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(
        name = "diagnoses",
        indexes = @Index(
                name = "idx_diagnoses_analyst_patient", columnList = "analyst_patient_id"))
@Getter
@Setter
@NoArgsConstructor
public class Diagnosis extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * The assignment, not the patient (spec section 2.4): a diagnosis belongs to the
     * analyst who made it as much as to the patient it is about, so two analysts
     * following the same person keep separate histories.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "analyst_patient_id", nullable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AnalystPatient analystPatient;

    /** When the diagnosis was made, which is not the same as when it was recorded. */
    @Column(name = "diagnosis_date", nullable = false)
    private Instant diagnosisDate;

    @Column(name = "diagnosis_text", nullable = false, columnDefinition = "text")
    private String diagnosisText;

    @Column(name = "notes", columnDefinition = "text")
    private String notes;

    /** Free text by explicit request (spec section 2.3), deliberately not a relation. */
    @Column(name = "medications", columnDefinition = "text")
    private String medications;
}
