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
 * A run of a path, recorded after the fact. The game is played elsewhere; this service
 * only stores what happened, so every value here is measured by the client rather than
 * observed by the server.
 */
@Getter
@Setter
@NoArgsConstructor
public class GameExecutionDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    /**
     * Which path this run belongs to (spec section 4.1, PathCode). Write-only: reads get
     * the same value inside {@code patientPath}, so it is not repeated in responses.
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank
    @Size(max = 12)
    private String uniqueCode;

    /** Resolved from the code; carries the patient, so responses need nothing else. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private PatientPathDTO patientPath;

    /** When the game started, as the game measured it -- not when it was reported. */
    @NotNull
    private Instant startedAt;

    /** Null for a session the game never closed. */
    private Instant finishedAt;

    /**
     * The telemetry, written with the run. Omitted from list responses; a PUT that
     * carries answers replaces the recorded set rather than adding to it.
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Valid
    private List<GameAnswerDTO> answers;
}
