package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * One node of the flow as it was played. Nothing is checked against the flow's graph:
 * the values are taken as the client reports them.
 */
@Getter
@Setter
@NoArgsConstructor
public class GameExecutionNodeDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @Size(max = 64)
    private String nodeId;

    @Size(max = 200)
    private String nodeName;

    /** The type's name. Registered in the node_types lookup the first time it is seen. */
    @NotBlank
    @Size(max = 100)
    private String nodeType;

    @NotNull
    private Boolean isExercise;

    private Double maxScore;

    private Double score;

    private Double percentageScore;

    private Double averageReactionTimeInMilliseconds;

    private Double averageResponseTimeInMilliseconds;

    private Double averageMouseDistanceInCentimeters;

    @Valid
    private List<GameAnswerDTO> answers;
}
