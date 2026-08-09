package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Every field is server-assigned: an execution is opened by redeeming a unique code, not
 * by describing itself in a payload.
 */
@Getter
@Setter
@NoArgsConstructor
public class GameExecutionDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID patientPathId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID patientId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String uniqueCode;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String polyglotPathId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant startedAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant finishedAt;

    /** Only populated on the detail endpoint; omitted entirely from list responses. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<GameExecutionNodeDTO> nodes;
}
