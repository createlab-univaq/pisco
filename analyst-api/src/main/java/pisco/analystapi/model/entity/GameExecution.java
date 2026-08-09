package pisco.analystapi.model.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * One run of one assigned path. Hanging it off the PatientPath rather than the Patient
 * is what makes the lookup by unique code a single join instead of a special case.
 */
@Entity
@Table(
        name = "game_executions",
        indexes = @Index(name = "idx_game_executions_path", columnList = "patient_path_id"))
@Getter
@Setter
@NoArgsConstructor
public class GameExecution extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_path_id", nullable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private PatientPath patientPath;

    /** Updatable: a re-recorded run replaces what was stored, timestamps included. */
    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    /** Null while the session is still open; the game may never close it. */
    @Column(name = "finished_at")
    private Instant finishedAt;

    @OneToMany(mappedBy = "execution", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceNumber asc")
    private List<GameAnswer> answers = new ArrayList<>();

    public void addAnswer(GameAnswer answer) {
        answer.setExecution(this);
        answers.add(answer);
    }
}
