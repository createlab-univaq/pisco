package pisco.analystapi.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/** Telemetry for one node traversed during a run (spec section 4.2). */
@Entity
@Table(name = "game_answers")
@Getter
@Setter
@NoArgsConstructor
public class GameAnswer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "execution_id", nullable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private GameExecution execution;

    /** Which Polyglot node this was, when the client knows it. Optional. */
    @Column(name = "polyglot_node_id", length = 64)
    private String polyglotNodeId;

    @Column(name = "node_name", length = 200)
    private String nodeName;

    /**
     * The lookup row rather than free text (spec section 4.2). Polyglot's type is an open
     * string upstream, so the service registers a code it has not seen before instead of
     * rejecting the telemetry -- see NodeTypeService.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "node_type_id", nullable = false)
    private NodeType nodeType;

    @Column(name = "reaction_time_ms")
    private Integer reactionTimeMs;

    @Column(name = "total_response_time_ms")
    private Integer totalResponseTimeMs;

    /** What the patient scored on this node (spec section 4.2, PatientScore). */
    @Column(name = "score")
    private Double score;

    /**
     * The most this node was worth, so a score can be read as a proportion without
     * knowing how the game weights its nodes (spec section 4.2, MaxScore).
     */
    @Column(name = "max_score")
    private Double maxScore;

    @Column(name = "mouse_distance_px")
    private Integer mouseDistancePx;

    /**
     * Null for nodes the patient never played -- the spec calls this out explicitly, so
     * absence here is data, not a gap.
     */
    @Column(name = "sequence_number")
    private Integer sequenceNumber;
}
