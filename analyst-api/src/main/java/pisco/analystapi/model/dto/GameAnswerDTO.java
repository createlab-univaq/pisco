package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Telemetry for one node traversed during a run (spec section 4.2). */
@Getter
@Setter
@NoArgsConstructor
public class GameAnswerDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @Size(max = 64)
    private String polyglotNodeId;

    @Size(max = 200)
    private String nodeName;

    /** Named by its label on the way in; the server resolves or registers the lookup row. */
    @NotNull
    @Valid
    private NodeTypeDTO nodeType;

    @PositiveOrZero
    private Integer reactionTimeMs;

    @PositiveOrZero
    private Integer totalResponseTimeMs;

    private Double score;

    /** The most this node was worth, so {@code score} can be read as a proportion. */
    private Double maxScore;

    @PositiveOrZero
    private Integer mouseDistancePx;

    /**
     * Omit it for a node the patient never played -- the spec says unplayed nodes carry
     * no sequence number, so null here is meaningful rather than missing.
     */
    @PositiveOrZero
    private Integer sequenceNumber;
}
