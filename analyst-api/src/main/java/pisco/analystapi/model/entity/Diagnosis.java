package pisco.analystapi.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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
        indexes = @Index(name = "idx_diagnoses_patient", columnList = "patient_id"))
@Getter
@Setter
@NoArgsConstructor
public class Diagnosis extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Patient patient;

    /** When the diagnosis was made, which is not the same as when it was recorded. */
    @Column(name = "diagnosis_date", nullable = false)
    private Instant diagnosisDate;

    @Lob
    @Column(name = "diagnosis_text", nullable = false)
    private String diagnosisText;

    @Lob
    @Column(name = "notes")
    private String notes;

    /** Free text by explicit request (spec section 2.3), deliberately not a relation. */
    @Lob
    @Column(name = "medications")
    private String medications;
}
