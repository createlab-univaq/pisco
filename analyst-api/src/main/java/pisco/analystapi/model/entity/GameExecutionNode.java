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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * One node of the flow as it was played, with the aggregates the client computed and the
 * individual answers behind them. Nothing here is checked against the flow's graph: the
 * node may since have been edited or removed, and the run still has to say what happened.
 */
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

    /**
     * Position in the run, taken from the order the client sent rather than from the
     * payload. Without it a JPA list comes back in whatever order the database chose.
     */
    @Column(nullable = false)
    private int position;

    /** The node's identifier inside the flow's graph, opaque here. */
    @Column(name = "node_id", length = 64)
    private String nodeId;

    @Column(name = "node_name", length = 200)
    private String nodeName;

    /** Whatever the front end called it. Not validated against anything. */
    @Column(name = "node_type", nullable = false, length = 100)
    private String nodeType;

    @Column(name = "is_exercise", nullable = false)
    private boolean exercise;

    @Column(name = "max_score")
    private Double maxScore;

    @Column(name = "score")
    private Double score;

    @Column(name = "percentage_score")
    private Double percentageScore;

    @Column(name = "avg_reaction_time_ms")
    private Double averageReactionTimeInMilliseconds;

    @Column(name = "avg_response_time_ms")
    private Double averageResponseTimeInMilliseconds;

    @Column(name = "avg_mouse_distance_cm")
    private Double averageMouseDistanceInCentimeters;

    @OneToMany(mappedBy = "executionNode", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position asc")
    private List<GameAnswer> answers = new ArrayList<>();

    public void addAnswer(GameAnswer answer) {
        answer.setExecutionNode(this);
        answer.setPosition(answers.size());
        answers.add(answer);
    }
}
