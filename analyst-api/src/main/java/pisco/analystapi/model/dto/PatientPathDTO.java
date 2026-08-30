package pisco.analystapi.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatientPathDTO {

    /** The association's own id -- what DELETE takes, not the flow id. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private PatientDTO patient;

    /**
     * The flow being assigned. Only its id is read on the way in; on the way out it comes
     * back without flowJson, which only the flow detail endpoint carries.
     */
    @NotNull
    @Valid
    private FlowDTO flow;

    /** Generated on assignment; the analyst hands it to the patient. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String uniqueCode;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant assignedAt;
}
