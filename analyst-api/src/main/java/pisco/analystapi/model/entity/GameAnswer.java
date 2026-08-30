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

/** A single attempt at a node. The aggregates over these live on the node itself. */
@Entity
@Table(
        name = "game_answers",
        indexes = @Index(name = "idx_game_answers_node", columnList = "execution_node_id"))
@Getter
@Setter
@NoArgsConstructor
public class GameAnswer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "execution_node_id", nullable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private GameExecutionNode executionNode;

    /** Order within the node, taken from the order the client sent. */
    @Column(nullable = false)
    private int position;

    @Column(name = "reaction_time")
    private Integer reactionTime;

    @Column(name = "response_time")
    private Integer responseTime;

    @Column(name = "mouse_distance")
    private Double mouseDistance;

    @Column(name = "correct", nullable = false)
    private boolean correct;
}
