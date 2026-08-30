package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** A single attempt at a node. */
@Getter
@Setter
@NoArgsConstructor
public class GameAnswerDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    private Integer reactionTime;

    private Integer responseTime;

    private Double mouseDistance;

    private boolean correct;
}
