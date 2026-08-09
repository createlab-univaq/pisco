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
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/** Telemetry for one node traversed during a run (spec section 4). */
@Entity
@Table(
        name = "game_execution_nodes",
        indexes = @Index(name = "idx_game_execution_nodes_execution", columnList = "execution_id"))
@Getter
@Setter
@NoArgsConstructor
public class GameExecutionNode extends BaseEntity {

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

    /**
     * Kept as free text: PolyglotNode.type is an open string upstream, so a local enum
     * would reject every node type Polyglot adds after this was written.
     */
    @Column(name = "node_type", nullable = false, length = 64)
    private String nodeType;

    @Column(name = "reaction_time_ms")
    private Integer reactionTimeMs;

    @Column(name = "score")
    private Double score;

    @Column(name = "mouse_distance_px")
    private Integer mouseDistancePx;

    /**
     * Null for nodes the patient never played -- the spec calls this out explicitly, so
     * absence here is data, not a gap.
     */
    @Column(name = "sequence_number")
    private Integer sequenceNumber;
}
