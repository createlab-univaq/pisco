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
 * The association between an assignment and a flow (spec section 3). Flows used to live
 * in Polyglot and were referenced by an external id; now that they are authored here it
 * is a plain foreign key, and the graph is read from the flow rather than fetched over
 * the network.
 */
@Entity
@Table(
        name = "patient_paths",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_patient_paths_assignment_flow",
                columnNames = {"analyst_patient_id", "flow_id"}),
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

    /**
     * The flow being followed. No cascade on delete: a flow already handed to a patient
     * cannot be deleted out from under them -- FlowService surfaces that as a 409.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "flow_id", nullable = false, updatable = false)
    private Flow flow;

    /**
     * Handed to the patient and typed into the game. It is the only credential guarding
     * the unauthenticated endpoints, hence 12 characters rather than a short code.
     */
    @Column(name = "unique_code", nullable = false, unique = true, updatable = false, length = 12)
    private String uniqueCode;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    private Instant assignedAt;
}
