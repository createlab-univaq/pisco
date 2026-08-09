package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Telemetry for one node traversed during a run (spec section 4). */
@Getter
@Setter
@NoArgsConstructor
public class GameExecutionNodeDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @Size(max = 64)
    private String polyglotNodeId;

    /** Free text: Polyglot's node type is an open string, so no local enum to violate. */
    @NotBlank
    @Size(max = 64)
    private String nodeType;

    @PositiveOrZero
    private Integer reactionTimeMs;

    private Double score;

    @PositiveOrZero
    private Integer mouseDistancePx;

    /**
     * Omit it for a node the patient never played -- the spec says unplayed nodes carry
     * no sequence number, so null here is meaningful rather than missing.
     */
    @PositiveOrZero
    private Integer sequenceNumber;
}
