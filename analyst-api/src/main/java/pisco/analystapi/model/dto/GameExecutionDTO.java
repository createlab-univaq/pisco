package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A run of a flow, recorded after the fact. The game is played elsewhere; this service
 * only stores what happened, so every value here is measured by the client rather than
 * observed by the server.
 */
@Getter
@Setter
@NoArgsConstructor
public class GameExecutionDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @Size(max = 200)
    private String runName;

    /**
     * The unique code of the assignment, not a flow id. Write-only: reads get the same
     * value inside patientPath, so it is not repeated in responses.
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank
    @Size(max = 12)
    private String flowCode;

    /** Resolved from the code; carries the patient and the flow. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private PatientPathDTO patientPath;

    /** When the game started, as the game measured it -- not when it was reported. */
    @NotNull
    private Instant startedAt;

    /** Null for a session the game never closed. */
    private Instant finishedAt;

    /**
     * The nodes played, in order. Omitted from list responses; a PUT that carries nodes
     * replaces the recorded set rather than adding to it.
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Valid
    private List<GameExecutionNodeDTO> nodes;
}
