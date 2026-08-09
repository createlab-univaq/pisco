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
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * The association between an assignment and a Polyglot path (spec section 3). Per that
 * section the local database stores only the external id -- no title, no nodes, nothing
 * that would go stale the moment the path is edited in Polyglot.
 */
@Entity
@Table(
        name = "patient_paths",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_patient_paths_assignment_path",
                columnNames = {"analyst_patient_id", "polyglot_path_id"}),
        indexes = @Index(
                name = "idx_patient_paths_analyst_patient", columnList = "analyst_patient_id"))
@Getter
@Setter
@NoArgsConstructor
public class PatientPath extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Hangs off the assignment rather than the patient: the path was prescribed by one
     * analyst, and the telemetry it collects answers to that analyst's view of the case.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "analyst_patient_id", nullable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AnalystPatient analystPatient;

    /** The flow id as Polyglot knows it (a Mongo id), opaque to this service. */
    @Column(name = "polyglot_path_id", nullable = false, updatable = false, length = 64)
    private String polyglotPathId;

    /**
     * Handed to the patient and typed into the game. It is the only credential guarding
     * the unauthenticated endpoints, hence 12 characters rather than a short code.
     */
    @Column(name = "unique_code", nullable = false, unique = true, updatable = false, length = 12)
    private String uniqueCode;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    private Instant assignedAt;
}
